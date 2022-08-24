import {Audio, AVPlaybackStatus} from 'expo-av';
import {BackgroundAudio, DMDAudio, Instruction, MeditationAudio, TypeDMDNotification} from "~modules/meditation/types";

const DefaultInstruction: Instruction = {

}

export default class Meditation {
	public id: string
	public name: string
	public description: string
	public image: string
	public isHaveBackground: boolean
	protected mainAudio?: MeditationAudio
	private _backgroundAudio?: BackgroundAudio
	public instruction: Instruction

	constructor(id: string, name: string, description: string, image: string, isHaveBackground: boolean, instruction:
		Instruction = DefaultInstruction, audio?: MeditationAudio) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.image = image;
		this.isHaveBackground = isHaveBackground
		this.mainAudio = audio
		this.instruction = instruction
	}

	async play () {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		if (this.isHaveBackground && this._backgroundAudio) {
			await this._backgroundAudio.sound.playAsync()
		}
		if (statusAudio.isPlaying) {
			await this.mainAudio.sound.playAsync()
		}
	}

	async pause () {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		if (this.isHaveBackground && this._backgroundAudio) {
			await this._backgroundAudio.sound.pauseAsync()
		}
		if (statusAudio.isPlaying) {
			await this.mainAudio.sound.pauseAsync()
		}
	}

	async editCurrentTime(milliseconds: number) {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		await this.mainAudio?.sound.setPositionAsync(milliseconds + statusAudio.positionMillis)
	}

	set backgroundAudio(audio: BackgroundAudio) {
		if (this.isHaveBackground) {
			this._backgroundAudio = audio
		} else {
			throw new Error("Meditation not have set background audio")
		}
	}

	get backgroundAudio(): BackgroundAudio {
		if (this.isHaveBackground) {
			if (this._backgroundAudio) {
				return this._backgroundAudio
			}
			throw new Error("Not found background audio")
		} else {
			throw new Error("Meditation not have get background audio")
		}
	}
}

export class DMD extends Meditation {
	private audios: DMDAudio[]
	private idListingAudio?: number
	private notification: { time: number, type: TypeDMDNotification }[] = []
	private isPlayNotification: boolean = false
	private currentVolume?: number
	constructor(id: string, name: string, description: string, image: string, audios: DMDAudio[]) {
		super(id, name, description, image, false);
		this.audios = audios
	}

	openAudio (audio: DMDAudio) {
		this.mainAudio = audio.data
		this.idListingAudio = this.audios.findIndex(item => item.name === audio.name)
	}

	async addNotification(time: number, type: TypeDMDNotification) {
		if (this.notification.length <= 3) {
			this.notification.push({ time, type })
			this.notification = this.notification.sort((item1, item2) => {
				if (item1.time < item2.time) {
					return 1
				}
				if (item1.time > item2.time) {
					return -1
				}
					return 0
				}
			)
		}
		await this.setSubscribeUpdate((status) => {
			if (status.isLoaded && status.isPlaying) {
				this.playNotification().catch()
			}
		})
	}

	async setSubscribeUpdate(callback?: (status: AVPlaybackStatus) => void) {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		this.mainAudio.sound.setOnPlaybackStatusUpdate((status)=>{
			if (callback) {
				callback(status)
			}
		})
	}

	async playNotification() {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		const nextNotification = this.notification.find(item => item.time >= statusAudio.positionMillis)
		if (nextNotification) {
			if (statusAudio.volume >= 0.5 && statusAudio.positionMillis - nextNotification.time) {
				this.isPlayNotification = true
				await this.mainAudio.sound.setVolumeAsync(0.6)
				await nextNotification.type.audio.playAsync()
				if (!this.isPlayNotification) {
					this.currentVolume = statusAudio.volume
					setTimeout((notification)=>this.stopNotification(notification), 5 * 1000, nextNotification.type.audio)
				}
			}
		}
	}

	async stopNotification(notification: Audio.Sound) {
		if (this.mainAudio === undefined) {
			throw new Error("Not Found Audio")
		}
		const statusAudio = await this.mainAudio.sound.getStatusAsync()
		if (!statusAudio.isLoaded) {
			throw new Error("Audio Not Loading")
		}
		if (this.isPlayNotification) {
			this.isPlayNotification = false
			await this.mainAudio.sound.setVolumeAsync(this.currentVolume ?? 1)
			await notification.stopAsync()

		}
	}
}

export class Relax extends Meditation{
	constructor(id: string, name: string, description: string, image: string, audio: MeditationAudio) {
		super(id, name, description, image, true, DefaultInstruction, audio);
	}
}

export class Vision extends Meditation{
	constructor(id: string, name: string, description: string, image: string, audio: MeditationAudio) {
		super(id, name, description, image, true, DefaultInstruction, audio);
	}
}
export class Breath extends Meditation{
	constructor(id: string, name: string, description: string, image: string, audio: MeditationAudio, instruction: Instruction) {
		super(id, name, description, image, true, instruction, audio);
	}
}

export class Base extends Meditation{
	constructor(id: string, name: string, description: string, image: string, audio: MeditationAudio, instruction: Instruction) {
		super(id, name, description, image, false, instruction, audio);
	}
}
