/** @format */

import React from "react";
import ViewPadding, { ViewPaddingProperty } from "src/components/layouts/view-padding";

export enum Direction {
	Horizontal,
	Vertical,
}

const fullingPaddingList = (paddings: number[], count: number) => {
	const paddingList = [];
	let paddingIndex = 0;
	for (let index = 0; index < count; index++) {
		paddingList.push(paddings[paddingIndex]);
		if (paddings[paddingIndex + 1] !== undefined) {
			paddingIndex++;
		}
	}
	return paddingList;
};

export interface VerticalProperty {
	top: number;
	bottom: number;
}

export interface HorizontalProperty {
	left: number;
	right: number;
}

export type DirectionProperty = VerticalProperty | HorizontalProperty;
export interface ViewPaddingListProperties {
	children: JSX.Element | JSX.Element[];
	paddings: number | number[];
	ifStrongCount?: boolean;
	direction: Direction;
}

const ViewPaddingList: React.FC<ViewPaddingListProperties> = property => {
	const { children, paddings, ifStrongCount, direction } = property;
	const paddingList: number[] = [];
	const countChildren = React.Children.count(children);
	const countPadding = countChildren + 1;
	if (ifStrongCount) {
		if (Array.isArray(paddings) && countPadding !== paddings.length) {
			throw new Error(
				`Количество отспутоп должно равнять кол-во потомков + 1: ${React.Children.count(children)} / ${
					paddings.length + 1
				}`
			);
		} else if (typeof paddings === "number") {
			throw new TypeError(
				`Когда ifStrongCount=true, paddings должен быть массивом и кол-во должно быть равно кол-во потомкам + 1`
			);
		}
	}
	if (Array.isArray(paddings) && paddings.length === countPadding) {
		paddingList.push(...paddings);
	} else {
		paddingList.push(...fullingPaddingList(typeof paddings === "number" ? [paddings] : paddings, countPadding));
	}

	const paddingsProperties: DirectionProperty[] = [];
	for (let ElementIndex = 0; ElementIndex < countChildren; ElementIndex++) {
		const start = paddingList[ElementIndex] / (ElementIndex === 0 ? 1 : 2);
		const end = paddingList[ElementIndex + 1] / (ElementIndex === countChildren - 1 ? 1 : 2);
		const propertyContentElement =
			direction === Direction.Vertical
				? {
						top: start,
						bottom: end,
				  }
				: {
						left: start,
						right: end,
				  };
		paddingsProperties.push(propertyContentElement);
	}
	const content = React.Children.map(children, (component, index) => (
		<ViewPadding {...paddingsProperties[index]}>{component}</ViewPadding>
	));
	return <>{content}</>;
};

export default ViewPaddingList;
