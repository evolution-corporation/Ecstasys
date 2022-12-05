/** @format */

import React from "react";
import ViewPadding from "src/components/layouts/view-padding";

export enum Direction {
	TopBottom,
	BottomTop,
	LeftRight,
	RightLeft,
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
	if (ifStrongCount) {
		if (Array.isArray(paddings) && countChildren !== paddings.length + 1) {
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
	paddingList.push(...fullingPaddingList(typeof paddings === "number" ? [paddings] : paddings, countChildren + 1));
	const paddingsProps = paddingList.map((padding, index) =>
		direction === Direction.TopBottom || direction === Direction.BottomTop
			? { top: index === 0 ? padding : padding / 2, bottom: index === paddingList.length - 1 ? padding : padding / 2 }
			: { left: index === 0 ? padding : padding / 2, right: index === paddingList.length - 1 ? padding : padding / 2 }
	);
	const content = React.Children.map(children, (component, index) => <ViewPadding>{component}</ViewPadding>);
	return <>{content}</>;
};

export default ViewPaddingList;
