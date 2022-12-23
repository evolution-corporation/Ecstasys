/** @format */

import React from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";

import { TimeLine, PlayerControl } from "~components/dump";

import i18n from "~i18n";
import gStyle from "~styles";

import MeditationTimeInBox from "~components/dump/meditation-time-in-box";
import BlackCircle from "~components/dump/black-circle";
import DefaultText from "~components/Text/default-text";

import PlayIcon from "assets/icons/PlayWhite.svg";
import ViewFullSpace, { Direction as DirectionFullSpace } from "~components/layouts/view-full-space";
import ViewPaddingList, { Direction as DirectionPaddingList } from "~components/containers/view-padding-list";
import ViewFullWidth, { Direction as DirectionFullWidth, PositionElements } from "~components/layouts/view-full-width";
import BackgroundSoundButton from "~components/dump/background-sound-button";

export enum Status {
	Loading,
	Play,
	Pause,
	Change,
	Init,
	Wait,
}

export interface PlayerProperty {
	currentMilliseconds: number;
	lengthMilliseconds: number;
	isSupportBackgroundSound?: boolean;
	onChangeCurrentMilliseconds: (millisecond: number) => Promise<void>;
	onChangeStatus: (status: Status.Play | Status.Pause) => Promise<void>;
	status: Status;
	id?: string;
	description?: string;
	rewindMillisecond?: number;
	onChangeStart: () => Promise<void>;
	onChangeEnd: () => Promise<void>;
}

const Player: React.FC<PlayerProperty> = React.forwardRef<React.ElementRef<typeof TimeLine>, PlayerProperty>(
	(property, reference) => {
		const {
			currentMilliseconds,
			lengthMilliseconds,
			onChangeCurrentMilliseconds,
			status,
			onChangeEnd,
			isSupportBackgroundSound,
			onChangeStart,
			onChangeStatus,
			description,
			rewindMillisecond = 15_000,
		} = property;
		if (status === Status.Init || status === Status.Loading) {
			return (
				<ViewFullSpace style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} direction={DirectionFullSpace.TopBottom}>
					<ViewPaddingList paddings={[0, 18]} direction={DirectionPaddingList.Vertical}>
						<BlackCircle size={100}>
							{status === Status.Loading ? <ActivityIndicator color={"#FFF"} /> : <PlayIcon />}
						</BlackCircle>
						{description === undefined ? <></> : <DefaultText>{description}</DefaultText>}
						<MeditationTimeInBox milliseconds={lengthMilliseconds} />
					</ViewPaddingList>
				</ViewFullSpace>
			);
		}
		if (status === Status.Wait) {
			const seconds = Math.floor(currentMilliseconds / 1000);
			const time = `${currentMilliseconds < 600_000 ? "0" : ""}${Math.floor(currentMilliseconds / 60_000)}:${
				seconds % 60 < 10 ? "0" : ""
			}${seconds % 60}`;
			return (
				<ViewFullSpace style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} direction={DirectionFullSpace.TopBottom}>
					<BlackCircle size={196}>
						<Text style={{ color: "#FFF", fontSize: 48, ...gStyle.font("400") }}>{time}</Text>
					</BlackCircle>
				</ViewFullSpace>
			);
		}

		const patternVisibleTime = lengthMilliseconds > 3600 * 1000 ? "%-H:%M:%S" : "%-H:%M:%S";
		return (
			<ViewFullSpace direction={DirectionFullSpace.TopBottom}>
				<View />
				<PlayerControl
					isPlay={status === Status.Play || status === Status.Change}
					pause={() => onChangeStatus(Status.Pause)}
					play={() => onChangeStatus(Status.Play)}
					stepBack={async () => {
						onChangeCurrentMilliseconds(
							currentMilliseconds > rewindMillisecond ? currentMilliseconds - rewindMillisecond : currentMilliseconds
						);
					}}
					stepForward={async () => {
						onChangeCurrentMilliseconds(
							currentMilliseconds + rewindMillisecond < lengthMilliseconds
								? currentMilliseconds + rewindMillisecond
								: lengthMilliseconds
						);
					}}
					rewindMillisecond={rewindMillisecond}
				/>
				<ViewFullWidth direction={DirectionFullWidth.TopBottom} style={{ height: 122 }}>
					<TimeLine
						ref={reference}
						onChange={async percent => {
							onChangeCurrentMilliseconds(lengthMilliseconds * percent);
						}}
						onStartChange={() => onChangeStart()}
						onEndChange={() => onChangeEnd()}
					/>
					<ViewFullWidth direction={DirectionFullWidth.LeftRight} mainPositionElements={PositionElements.StartEnd}>
						<DefaultText color={"#FFFFFF"} key={"current"}>
							{i18n.strftime(new Date(currentMilliseconds - 5 * 3600 * 1000), patternVisibleTime)}
						</DefaultText>
						<DefaultText color={"#FFFFFF"} key={"all"}>
							{i18n.strftime(new Date(lengthMilliseconds - 5 * 3600 * 1000), patternVisibleTime)}
						</DefaultText>
					</ViewFullWidth>
					{isSupportBackgroundSound ? <BackgroundSoundButton /> : <></>}
				</ViewFullWidth>
			</ViewFullSpace>
		);
	}
);

export default Player;
