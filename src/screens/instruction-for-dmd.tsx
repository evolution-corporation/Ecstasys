/** @format */

import React from "react";
import { Text, ScrollView, Pressable } from "react-native";

import { RootScreenProps } from "~types";
import { Screen } from "~components/containers";

import { ColorButton } from "~components/dump";
import InstructionPattern from "~components/dump/instruction-pattern";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import gStyle from "~styles";
import Chevron from "assets/Vector.svg";

const InstructionForDMD: RootScreenProps<"InstructionForDMD"> = ({ route, navigation }) => {
	const rotateChevron = useSharedValue("0deg");
	const styleChevron = useAnimatedStyle(() => ({
		transform: [{ rotate: withTiming(rotateChevron.value) }],
	}));
	const [isShowFeatures, setIsShowFeatures] = React.useState(false);
	React.useEffect(() => {
		rotateChevron.value = isShowFeatures ? "90deg" : "0deg";
	}, [isShowFeatures]);
	return (
		<Screen backgroundColor={"#9765A8"} paddingHorizontalOff>
			<ScrollView style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
				<InstructionPattern
					data={[
						{ text: "Процесс начинается с настройки, для этого выбери заинтересовавший тебя сюжет." },
						{
							text: "Далее выбери музыкальную сессию. Сессии очень разные в каждой особое настроение и сюжет, который будет вести тебя на протяжении процесса. Ты можешь предварительно прослушать сет, чтобы почувствовать общее настроения сессии.",
						},
						{
							text: "Установи таймер активного дыхания (подробнее ниже) от 5 до 10 минут. Чем дольше время активного дыхания, тем глубже пройдет процесс.",
						},
						{ text: "Установи таймер спонтанного дыхания (подробнее ниже)." },
						{ text: "Начни ДМД" },
					]}
					description={
						"ДМД (Дыхание Музыка Движение) – дыхательный процесс, состоящий из нескольких стадий. Задача ДМД активировать внутренние ресурсы для раскрытия твоего потенциала, осмыслить происходящее с тобой с других граней, найти возможность для новых идей и действий."
					}
					title={"Инструкция ДМД"}
				/>
				<Pressable
					style={{
						backgroundColor: "#9765A8",
						borderRadius: 15,
						height: 45,
						justifyContent: "center",
						flexDirection: "row",
						alignItems: "center",
						marginBottom: isShowFeatures ? 0 : 20,
					}}
					onPress={() => setIsShowFeatures(previous => !previous)}
				>
					<Text style={{ ...gStyle.font("500"), fontSize: 14, color: "#FFF" }}>Особенности этапов</Text>
					<Animated.View
						style={[
							styleChevron,
							{
								width: 24,
								height: 24,
								right: 10,
								position: "absolute",
								justifyContent: "center",
								alignItems: "center",
							},
						]}
					>
						<Chevron />
					</Animated.View>
				</Pressable>
				{isShowFeatures ? (
					<Animated.View entering={FadeIn} exiting={FadeOut}>
						<InstructionPattern
							data={[
								{
									text: "Настройка. Задача настройки погрузить тебя в просоночное состояние или состояние максимального расслабления. Для этого ляг в позу, в которой ты засыпаешь и слушай сюжет. Следуй за сюжетом и визуализируй его или просто слушай, словно сказку перед сном. После того как я предложу тебе «сделать первый мягкий вдох и мягкий медленный выдох» начни медленно и плавно углублять дыхание и постепенно увеличивать его скорость.",
								},
								{
									text: " Активное дыхание. На этой стадии дыши только ртом. После звукового сигнала твое дыхание должно быть максимально глубоким и максимально быстрым. Акцент делаешь на вдох, выдох происходит произвольно за счет расслабления. Не нужно выдыхать с силой, не форсируй выдох, пусть он будет естественным. Дыши так до следующего звукового сигнала (от 5 до 10 минут)\nЕсли ты не используешь звуковой сигнал на стадиях, тогда дыши активно пока не надоест или не устанешь.\nНа этой стадии появится желание двигаться, следуй за этим ощущением и двигайся так как тебе хочется.",
								},
								{
									text: "Установи таймер активного дыхания (подробнее ниже) от 5 до 10 минут. Чем дольше время активного дыхания, тем глубже пройдет процесс.",
								},
								{
									text: "Спонтанное дыхание. Эта стадия твоего эксперимента с дыханием. У дыхания есть 3 переменные:\n• Глубина дыхания\n• Скорость дыхания\n• Соотношение выдоха и вдоха (длинный вдох, короткий выдох и наоборот)\nТвоя задача экспериментировать с этими переменными, тут ты можешь дышать носом, выдыхать через рот и наоборот. Выдыхать форсированно, дышать со звуками, кричать, стонать смеяться в общем делать все, что душе угодно. Главное проявляйся, чувствуй себя и свои порывы. Неотъемлемой частью этой стадии является движение, оно такое же спонтанное как дыхание. Дергайся, дрыгайся, потягивайся двигайся, высвобождая напряжение и пусть дыхание проникает все глубже в тебя. Ведь скучно просто лежать и дышать, движение придает драйв, азарт и в конце концов ты объединишь в единую структуру свое дыхание, музыку и движение. Это и будет ДМД, которое откроет для тебя перспективу возможностей для реализации твоего потенциала!\nДыши и двигайся до звукового сигнала.",
								},
								{
									text: "Интеграция. Поверхностное дыхание. Это заключительная стадия, которая объединяет и укладывает пройденный в процессе опыт, озарения, открытия, мысли, осознания и т.д. музыка тут спокойная и плавная, громкость снизится. На этой стадии дыши поверхностно и медленно, словно перед засыпанием. Насладись музыкальным контекстом и полностью расслабься. ",
								},
							]}
							description={
								"Процесс происходит лежа и с закрытыми глазами. На протяжении всей сессии используется связанное дыхание (без паузы между выдохом и вдохом, вдох плавно перетекает в выдох, а выдох во вдох)"
							}
							title={"Особенности этапов ДМД"}
						/>
					</Animated.View>
				) : null}

				<ColorButton
					onPress={() => {
						navigation.goBack();
					}}
					styleButton={{ backgroundColor: "#C2A9CE", marginBottom: 50 }}
					styleText={{ color: "#FFFFFF" }}
				>
					К практике
				</ColorButton>
			</ScrollView>
		</Screen>
	);
};

export default InstructionForDMD;
