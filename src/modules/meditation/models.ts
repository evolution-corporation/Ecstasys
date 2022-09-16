import { Audio, AVPlaybackStatus } from "expo-av";
import {
  BackgroundAudio,
  DMDAudio,
  Instruction,
  MeditationAudio,
  TypeDMDNotification,
} from "~modules/meditation/types";

import BackgroundSound from "./backgroundSound";

const DefaultInstruction: Instruction = {};

class MeditationV1 {
  public id: string;
  public name: string;
  public description: string;
  public image: string;
  public isHaveBackground: boolean;
  protected mainAudio?: MeditationAudio;
  protected _backgroundAudio?: BackgroundAudio;
  public instruction: Instruction;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    isHaveBackground: boolean,
    instruction: Instruction = DefaultInstruction,
    audio?: MeditationAudio
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.isHaveBackground = isHaveBackground;
    this.mainAudio = audio;
    this.instruction = instruction;
  }

  public async play() {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    if (this.isHaveBackground && this._backgroundAudio) {
      await this._backgroundAudio.sound.playAsync();
    }
    if (!statusAudio.isPlaying) {
      await this.mainAudio.sound.playAsync();
    }
  }

  public async pause() {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    if (this.isHaveBackground && this._backgroundAudio) {
      await this._backgroundAudio.sound.pauseAsync();
    }
    if (statusAudio.isPlaying) {
      await this.mainAudio.sound.pauseAsync();
    }
  }

  public async editCurrentTime(milliseconds: number) {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    await this.mainAudio?.sound.setPositionAsync(
      milliseconds + statusAudio.positionMillis
    );
  }

  public set backgroundAudio(audio: BackgroundAudio) {
    if (this.isHaveBackground) {
      this._backgroundAudio = audio;
    } else {
      throw new Error("Meditation not have set background audio");
    }
  }

  public get backgroundAudio(): BackgroundAudio {
    if (this.isHaveBackground) {
      if (this._backgroundAudio !== undefined) {
        return this._backgroundAudio;
      }
      throw new Error("Not found background audio");
    } else {
      throw new Error("Meditation not have get background audio");
    }
  }
}

class Meditation extends MeditationV1 {
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    isHaveBackground: boolean,
    instruction: Instruction = DefaultInstruction,
    audio?: MeditationAudio
  ) {
    super(id, name, description, image, isHaveBackground, instruction, audio);
  }
  public getLengthTime(type: TypeReturnTime = "mm:ss"): string {
    if (this.mainAudio === undefined) {
      return "Not found Audio";
    }
    if (type === "mm:ss") {
      const allSeconds = Math.floor(this.mainAudio.length / 1000);
      const minutes = Math.floor(allSeconds / 60);
      const seconds = allSeconds % 60;
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    } else {
      return `${this.mainAudio.length}`;
    }
  }

  protected _onUpdateAudioData?: (status: StatusMeditationAudio) => void;
  protected _typeReturnTime?: TypeReturnTime;
  protected _positionMillis: number = 0;
  protected _timerNode?: NodeJS.Timer;
  protected _isPlaying: boolean = false;

  public get isPlaying() {
    return this._isPlaying;
  }

  public setOnUpdateAudioData(
    callback: (status: StatusMeditationAudio) => void,
    typeView: TypeReturnTime = "mm:ss"
  ) {
    this._onUpdateAudioData = callback;
    this._typeReturnTime = typeView;
    this.callCallback();
  }

  protected addTimeTimer(milliseconds: number = 100) {
    this._positionMillis += milliseconds;
    if (this.mainAudio && this._positionMillis >= this.mainAudio.length) {
      if (this._positionMillis > this.mainAudio.length)
        this._positionMillis = this.mainAudio.length;
      this.stop();
    }
    this.callCallback();
  }

  protected async callCallback() {
    if (this.mainAudio !== undefined) {
      let timeView: string;
      if (this._typeReturnTime === "mm:ss") {
        const allSeconds = Math.floor(this._positionMillis / 1000);
        const minutes = Math.floor(allSeconds / 60);
        const seconds = allSeconds % 60;
        timeView = `${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`;
      } else {
        timeView = `${this._positionMillis}`;
      }
      if (this._onUpdateAudioData)
        this._onUpdateAudioData({
          positionMillis: this._positionMillis,
          viewTime: timeView,
          isPlaying: this._isPlaying,
          percent: this._positionMillis / this.mainAudio.length,
        });
    }
  }

  public async play() {
    if (this._timerNode) clearInterval(this._timerNode);
    await super.play();
    this._timerNode = setInterval(() => this.addTimeTimer(), 100);
    this._isPlaying = true;
    this.callCallback();
  }
  public async pause() {
    if (this._timerNode) clearInterval(this._timerNode);
    await super.pause();
    this._isPlaying = false;
    this.callCallback();
  }
  public async editCurrentTime(milliseconds: number) {
    if (this._timerNode) clearInterval(this._timerNode);
    await super.editCurrentTime(milliseconds);
    this._positionMillis += milliseconds;
    if (this._isPlaying)
      this._timerNode = setInterval(() => this.addTimeTimer(), 100);
  }

  public async stop() {
    if (this._timerNode) clearInterval(this._timerNode);
    this.mainAudio?.sound.stopAsync();
    this._isPlaying = false;
  }

  public async setPostionMillisecondspercentPercent(percent: number) {
    if (this._timerNode) clearInterval(this._timerNode);
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    await this.mainAudio?.sound.setPositionAsync(
      this.mainAudio.length * percent
    );
    this._positionMillis = this.mainAudio.length * percent;
    if (this._isPlaying) {
      this._timerNode = setInterval(() => this.addTimeTimer(), 100);
    } else {
      this.callCallback();
    }
  }

  private _backgroundSoundVolume?: number;

  public get backgroundSoundVolume() {
    return this._backgroundSoundVolume ?? 1;
  }

  public async setVolumeBackgroundSound(volume: number) {
    this._backgroundSoundVolume = volume;
    if (this._backgroundAudio !== undefined) {
      await this._backgroundAudio.sound.setVolumeAsync(volume);
    }
  }

  public async setMeditationBackground(name: keyof typeof BackgroundSound) {
    if (this._backgroundAudio !== undefined) {
      this._backgroundAudio.sound.stopAsync();
    }
    this._backgroundAudio = {
      name,
      sound: (await Audio.Sound.createAsync(BackgroundSound[name].audio)).sound,
    };
  }

  public async unsetMeditationBackground() {
    if (this._backgroundAudio !== undefined) {
      this._backgroundAudio.sound.stopAsync();
    }
    this._backgroundAudio = undefined;
  }

  public get nameMeditationBackground(): keyof typeof BackgroundSound | null {
    return this._backgroundAudio !== undefined
      ? (this._backgroundAudio.name as keyof typeof BackgroundSound)
      : null;
  }

  public getLengthTimeFake(
    precent: number,
    type: TypeReturnTime = "mm:ss"
  ): string {
    if (this.mainAudio === undefined) {
      return "Not found Audio";
    }
    const time = this.mainAudio.length * precent;
    if (type === "mm:ss") {
      const allSeconds = Math.floor(time / 1000);
      const minutes = Math.floor(allSeconds / 60);
      const seconds = allSeconds % 60;
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    } else {
      return `${time}`;
    }
  }
}

export class DMD extends Meditation {
  private audios: DMDAudio[];
  private idListingAudio?: number;
  private notification: { time: number; type: TypeDMDNotification }[] = [];
  private isPlayNotification: boolean = false;
  private currentVolume?: number;
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    audios: DMDAudio[]
  ) {
    super(id, name, description, image, false);
    this.audios = audios;
  }

  openAudio(audio: DMDAudio) {
    this.mainAudio = audio.data;
    this.idListingAudio = this.audios.findIndex(
      (item) => item.name === audio.name
    );
  }

  async addNotification(time: number, type: TypeDMDNotification) {
    if (this.notification.length <= 3) {
      this.notification.push({ time, type });
      this.notification = this.notification.sort((item1, item2) => {
        if (item1.time < item2.time) {
          return 1;
        }
        if (item1.time > item2.time) {
          return -1;
        }
        return 0;
      });
    }
    await this.setSubscribeUpdate((status) => {
      if (status.isLoaded && status.isPlaying) {
        this.playNotification().catch();
      }
    });
  }

  async setSubscribeUpdate(callback?: (status: AVPlaybackStatus) => void) {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    this.mainAudio.sound.setOnPlaybackStatusUpdate((status) => {
      if (callback) {
        callback(status);
      }
    });
  }

  async playNotification() {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    const nextNotification = this.notification.find(
      (item) => item.time >= statusAudio.positionMillis
    );
    if (nextNotification) {
      if (
        statusAudio.volume >= 0.5 &&
        statusAudio.positionMillis - nextNotification.time
      ) {
        this.isPlayNotification = true;
        await this.mainAudio.sound.setVolumeAsync(0.6);
        await nextNotification.type.audio.playAsync();
        if (!this.isPlayNotification) {
          this.currentVolume = statusAudio.volume;
          setTimeout(
            (notification) => this.stopNotification(notification),
            5 * 1000,
            nextNotification.type.audio
          );
        }
      }
    }
  }

  async stopNotification(notification: Audio.Sound) {
    if (this.mainAudio === undefined) {
      throw new Error("Not Found Audio");
    }
    const statusAudio = await this.mainAudio.sound.getStatusAsync();
    if (!statusAudio.isLoaded) {
      throw new Error("Audio Not Loading");
    }
    if (this.isPlayNotification) {
      this.isPlayNotification = false;
      await this.mainAudio.sound.setVolumeAsync(this.currentVolume ?? 1);
      await notification.stopAsync();
    }
  }
}

export class Relax extends Meditation {
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    audio: MeditationAudio
  ) {
    super(id, name, description, image, true, DefaultInstruction, audio);
  }
}

export class Vision extends Meditation {
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    audio: MeditationAudio
  ) {
    super(id, name, description, image, true, DefaultInstruction, audio);
  }
}
export class Breath extends Meditation {
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    audio: MeditationAudio,
    instruction: Instruction
  ) {
    super(id, name, description, image, true, instruction, audio);
  }
}

export class Base extends Meditation {
  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    audio: MeditationAudio,
    instruction: Instruction
  ) {
    super(id, name, description, image, false, instruction, audio);
  }
}

export default Meditation;

type TypeReturnTime = "mm:ss" | "milliseconds";

interface StatusMeditationAudio {
  positionMillis: number;
  viewTime: string;
  isPlaying: boolean;
  percent: number;
}
