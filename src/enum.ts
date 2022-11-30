/** Пол пользователя */
export enum Gender {
	/** Мужской */
	MALE = "MALE",
	/** Женский */
	FEMALE = "FEMALE",
	/** Другой/неопределенно */
	OTHER = "OTHER",
}

/** Тип подписки пользователя строковой формат */
export enum SubscribeType {
	/** Пробная подписка в длинною 7 дней */
	WEEK = "Week",
	/** Подписка при которой будет происходить ежемесячное списание средств */
	MONTH = "Month",
	/** Подписка при которой будет происходить списание средств раз в 6 месяцев */
	HALF_YEAR = "Month6",
}

/** Статус авторизации аккаунта в приложении */
export enum AccountStatus {
	/** Данные пользователя найдены в системе Evolution и в Firebase */
	REGISTRATION,
	/** Данные пользователя не найдены в системе Evolution, но его данные найдены в Firebase */
	NO_REGISTRATION,
	/** Данные пользователя не найдены в системе Evolution и в Firebase */
	NO_AUTHENTICATION,
	ERROR,
}

export enum PracticesMeditation {
	BASIC = "Basic",
	BREATHING_PRACTICES = "BreathtakingPractice",
	DANCE_PSYCHOTECHNICS = "DancePsychotechnics",
	DIRECTIONAL_VISUALIZATIONS = "DirectionalVisualizations",
	RELAXATION = "Relaxation",
}
