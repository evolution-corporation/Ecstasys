import * as FirebaseAuth from 'firebase/auth'
import { getApp, initializeApp } from 'firebase/app';

// ENUM
export enum UserCategory {
	BLOGGER = 'blogger',
	COMMUNITY = 'community',
	ORGANIZATION = 'organization',
	EDITOR = 'editor',
	WRITER = 'writer',
	GARDENER = 'gardener',
	FLOWER_MAN = 'theFlowerMan',
	PHOTOGRAPHER = 'photographer',
	NONE = '',
}
export enum UserGender {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other',
}
export enum UserRole {
	USER,
	ADMIN,
	NO_REGISTRATION,
}

// interface
interface GetUserByIdOptions {
	getPlants?: boolean
	is_minimum_data?: boolean
}
interface GetUserByNickName {
	getPlants?: boolean
	is_minimum_data?: boolean
	strong?: boolean
	limit?: number
}
interface CheckNickNameUnique {
	isGenerateVariableNickname?: boolean
}
interface CheckNickNameUniqueResult {
	checking_unique_nick_name: boolean, nickname_variable?: Array<string>
}
export interface UserConstructor {
	uid: string,
	nickName: string,
	image: string | URL | null,
	role: string | UserRole,
	status?: string,
	gender?: string | UserGender,
	category?: string | UserCategory,
	plantCount?: number,
	birthday: Date | string,
	plants?: Array<any>
	displayName?: string
}

// account
interface AuthState {
	account?: Account
}
interface UserUpdate {
	nickName?: string,
	image?: string,
	status?: string | null,
	gender?: UserGender,
	category?:  UserCategory,
	birthday?: Date,
}
interface UserCreate {
	nickname: string
	birthday?: Date
	status?: string
	gender?: UserGender
	category?: UserCategory,
	image?: string,
	displayName?: string
}
interface UserFirebaseData{
	displayName: string | undefined,
	photo: string | undefined
}
// type
export type StatusAuth = 'loading' | 'noAuthorization' |'registration' | 'noRegistration' | 'Error'

// const
const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/plants-336217.appspot.com/o/avatars%2FGroup%20638.png?alt=media&token=130ffa3d-5672-447c-b156-222382e612bf'//'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACZCAYAAAA8XJi6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATtSURBVHgB7d3ZbhpLGEXhxvPw/u/Jhecx2jil4MixgbDp+muvT0I+R8oEvSh6qmKxXC7fJ8DoaALMiAx2RAY7IoMdkcGOyGBHZLAjMtgRGeyIDHZEBjsigx2RwY7IYEdksCMy2BEZ7IgMdkQGOyKDHZHBjshgR2SwIzLYERnsiAx2RAY7IoMdkcGOyGBHZLAjMtgRGeyIDHZEBjsigx2Rwe5kwj8tFovp+Ph4Ojo6Wv3U/+sh7+/v09vb2/T6+rp66L/xNSL7wunp6XR2djadnGz+8iiy5+fn6enpieD+QmRrzs/PV482Wm1Do137/Qrt8fGR2H4jsukjkMvLy61Gru+0UbDFli4+MgVxcXGx0+j1HYWrP1c/Hx4eVvtwqaKPLhWBRrB9B7ZOEV9fX1v/jt7FRqbAtP90CDoyTQ4tMjIdPR4qsEahKexEcZG1faU56KPz0HH3IC4ybWSFlvr3zyHq2eq0gkaTOWm/LG00i4qsl42r0JNGs5hnqo26r5Ot+6CDjxQxkc39Mfm3pI/MmMh6GsWk3eGRICKyXjcokQ2k141JZAPp9XJOymUmIptRymkM7vGHHZHNKOUes4jIkm8Y7EFEZL3ea69ZTgkiItPG7HE0I7LB9LhBiWwwmhPZk6QJwVGR9fSRmTRVLiYyBdbLaNaWN0gRdZ6sl9EjbSmDqMi0YTXRdu5/Q9qs8rgz/nOPInd3d1OauMi0b3Z7ezvLQYBG0aR9sSby2qVGskOHpsBSF1+JvUCuEeVQoSUHJtF3YSi0m5sb2z6aAr6/v49fPir+Vh8FptD2HcLLy8tqpNSBRjoWwZs+Rhx9pCkITVX7n+lzikt/Tm+XseZEZGs0qrWPN02h0wTcTabSKdIWVuLR40+I7AuKTdHoofkBuhe/PdZ/jeLq9TainhDZD1pIjFC74x5/2BEZ7Ib+uNQM7faNIj3OvWz7dfqpo9JRDRdZOyrUo9IM7Xa/mx6jBTdMZIpL57h6W71nU3pD6PycHopMp1JGuedssVwuSx9/a+NooeHe1h/bB52vm/v+t30oPZJpX+vq6mrY1XHayKx70CqPamWPLhWYvoBh9OWX2hdNVF6cpeS/XB+R1V/4bbQRu+pSUyW3UvtirCQa0aquM1tuS7UjsERVj57LRZb4tTHr9K121ZSKLO1LFr6i51/tOwDKRYZ6r0OZyPQOTlkt+ifaL6t0pFkmsqqXi1wqfWSWiYxR7LNKr0epj0v8Uen1ILKiiAxYQ2SwKxMZ084+q3TrT5nImJL2WaU3HZEVVWkeQJnIRp7Ns4tKb7oykY0+bWwb1VbPLnV0yUo5H6pNLikXWfpRpkaxam+2UpEpsPRVCytOkSt3MlaRpe6btRnm1ZQ84199HuIueviii12VjKytxZ8SWlsSvurzLXvtsvoLv6kRnmfpC+RtA4y6wrT2v5xLwB9K+Xua22LCOjmp6XIj3Hem56T9zlEupQ1z43xbSFgzeTZdtbo3Omoe8eh5uNkZLba2WnVbbbHnlRY1YimsUU80DzsFSBuQ65194M5Y2BEZ7IgMdkQGOyKDHZHBjshgR2SwIzLYERnsiAx2RAY7IoMdkcGOyGBHZLAjMtgRGeyIDHZEBjsigx2RwY7IYEdksCMy2BEZ7IgMdkQGOyKDHZHBjshgR2SwIzLYERnsiAx2RAY7IoPdLx4vHZhTmPERAAAAAElFTkSuQmCC'
const app = initializeApp({
	apiKey: "AIzaSyD_PgEbxHTvkzORYuYJuij_6Nrt_VsUqfw",
	authDomain: "plants-336217.firebaseapp.com",
	databaseURL: "https://plants-336217-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "plants-336217",
	storageBucket: "plants-336217.appspot.com",
	messagingSenderId: "878799007977",
	appId: "1:878799007977:web:f3b21a3a35597f03da0078"
})

export default class User{
	public readonly uid: string
	public nickName?: string
	public readonly role: UserRole
	public _image?: URL
	public status?: string | null
	public category?: UserCategory
	public gender?: UserGender
	public plantCount?: number
	public plants?: Array<any>
	public birthday?: Date
	public displayName?: string
	
	constructor(data: UserConstructor, options?: { } ) {
		this.uid = data.uid
		this.nickName = data.nickName
		this.status = data.status
		if (typeof data.role == 'string') {
			switch (data.role) {
				case ('NO_REGISTRATION'):
					this.role = UserRole.NO_REGISTRATION
					break;
				case ('USER'):
					this.role = UserRole.USER
					break;
				case ('ADMIN'):
					this.role = UserRole.ADMIN
					break;
				default:
					this.role = UserRole.USER
			}
		} else {
			this.role = data.role
		}
		if (typeof data.category == 'string') {
			switch (data.category) {
				case 'NULL':
					this.category = UserCategory.NONE
					break;
				case 'BLOGGER':
					this.category = UserCategory.BLOGGER
					break;
				case 'COMMUNITY':
					this.category = UserCategory.COMMUNITY
					break;
				case 'ORGANIZATION':
					this.category = UserCategory.ORGANIZATION
					break;
				case 'EDITOR':
					this.category = UserCategory.EDITOR
					break;
				case 'WRITER':
					this.category = UserCategory.WRITER
					break;
				case 'GARDENER':
					this.category = UserCategory.GARDENER
					break;
				case 'FLOWER_MAN':
					this.category = UserCategory.FLOWER_MAN
					break;
				case 'PHOTOGRAPHER':
					this.category = UserCategory.PHOTOGRAPHER
					break;
				default:
					this.category = undefined
			}
		} else {
			this.category = data.category
		}
		if (typeof data.gender == 'string') {
			switch (data.gender) {
				case 'MALE':
					this.gender = UserGender.MALE
					break;
				case 'FEMALE':
					this.gender = UserGender.FEMALE
					break;
				case 'OTHER':
					this.gender = UserGender.OTHER
					break;
				default:
					this.gender = undefined
			}
		}
		if (typeof data.image == 'string') {
			this._image = new URL(`user/${data.image}`, 'http://192.168.1.146:5000/image')
		} else {
			if (data.image instanceof URL) {
				this._image = data.image
			}
		}
		if (typeof data.birthday == 'string') {
			this.birthday = new Date(Date.parse(data.birthday))
		} else {
			this.birthday = data.birthday
		}
		this.displayName = data.displayName
		if (data.plantCount != undefined){
			this.setPlants(data.plantCount, data.plants)
		}
	}
	
	protected setPlants(countPlants: number, plants?: Array<any>) {
		this.plantCount = countPlants
		if (plants != undefined) {
			this.plants = plants
		}
	}
	
	public get image() {
		if (this._image != undefined) {
			return String(this._image)
		}
		return defaultImage
	}
	
	public static async getUserById(id: string, options?: GetUserByIdOptions): Promise<User> {
		const url = new URL(`/user/${id}`, 'http://192.168.1.146:5000/api')
		url.searchParams.append('get_plants', String(options?.getPlants ?? false))
		url.searchParams.append('is_minimum_data', String(options?.is_minimum_data ?? false))
		const request = await fetch(url.toJSON(), {
			method: 'GET',
			headers: {
				'app': 'Plants'
			}
		})
		if (!request.ok) throw new Error(String(request.status))
		const result = (await request.json()).result
		return new User(result)
	}
	
	public static async getUsersByNickName(nickName: string, options?: GetUserByNickName): Promise<Array<User>>{
		const url = new URL(`/users.search/${nickName}`, 'http://192.168.1.146:5000/api')
		url.searchParams.append('get_plants', String(options?.getPlants ?? false))
		url.searchParams.append('is_minimum_data', String(options?.is_minimum_data ?? false))
		url.searchParams.append('strong', String(options?.strong ?? false))
		url.searchParams.append('limit', String(options?.limit ?? 20))
		const request = await fetch(url.toJSON(), {
			method: 'GET',
			headers: {
				'app': 'Plants'
			}
		})
		if (!request.ok) throw new Error(String(request.status))
		const result = (await request.json()).result
		return JSON.parse(result).map((data: any) => new User(data as UserConstructor))
	}
	
	public static async checkNickNameUnique(nickName: string, options?: CheckNickNameUnique): Promise<CheckNickNameUniqueResult> {
		const url = new URL(`nickName/${nickName}`, 'http://192.168.1.146:5000/api');
		url.searchParams.append('generate_nickname', String(options?.isGenerateVariableNickname ?? false))
		const request = await fetch(url.toJSON(), {
			method: 'GET',
			headers: {
				'app': 'Plants'
			}
		})
		if (!request.ok) throw new Error(String(request.status))
		return (await request.json()).result as CheckNickNameUniqueResult
	}
}

export class Account{
	public statusAuth: StatusAuth
	public user?: User | null
	public callback?: {(account: StatusAuth, message?: string): void}
	
	constructor() {
		this.statusAuth = 'loading'
		FirebaseAuth.onAuthStateChanged(FirebaseAuth.getAuth(app), (user) => this.onAuthChange(user))
	}
	
	private async onAuthChange (user: FirebaseAuth.User | null) {
			if (user != null) {
					const userData = await this.getAccountData()
					if (userData == undefined || userData.birthday == undefined || userData.nickName == undefined) {
						this.statusAuth = 'noRegistration'
					} else {
						this.user = userData
						this.statusAuth = 'registration'
					}
			} else {
				this.user = null
				this.statusAuth = 'noAuthorization'
			}
			if (this.callback != undefined) {
				this.callback(this.statusAuth)
			}
	}
	
	protected async onToken(): Promise<string> {
		const fireBaseAuth = FirebaseAuth.getAuth()
		if (fireBaseAuth.currentUser == null) throw new Error('Not found current user')
		return await fireBaseAuth.currentUser.getIdToken()
	}
	
	public get uid() {
		if (this.user) {
			return this.user.uid
		}
	}
	public get nickName() {
		if (this.user) {
			return this.user.nickName
		}
	}
	public get role() {
		if (this.user) {
			return this.user.role
		}
	}
	public get image() {
		if (this.user) {
			return this.user.image
		}
	}
	public get status() {
		if (this.user) {
			return this.user.status
		}
	}
	public get category() {
		if (this.user) {
			return this.user.category
		}
	}
	public get gender() {
		if (this.user) {
			return this.user.gender
		}
	}
	public get plantCount() {
		if (this.user) {
			return this.user.plantCount
		}
	}
	public get plants() {
		if (this.user) {
			return this.user.plants
		}
	}
	public get birthday() {
		if (this.user) {
			return this.user.birthday
		}
	}
	public get displayName() {
		if (this.user) {
			return this.user.displayName
		}
	}
	
	public on(callback: {(account: StatusAuth, message?: string): void}) {
		this.callback = callback
		callback(this.statusAuth)
	}
	
	public async update(data: UserUpdate): Promise<void> {
		if (!this.user) throw new Error('Don`t can get user')
		if (this.onToken == undefined) throw new Error('Don`t can get token')
		const url = new URL(`users/${this.uid}`, 'http://192.168.1.146:5000/api')
		const token = await this.onToken()
		if (data.image != undefined) {
			if (!data.image.includes('data:image/') && !data.image.includes('base64')) {
				const formData = new FormData()
				formData.append('image', data.image)
				const request = await fetch(url.toJSON(), {
					method: 'PUT',
					headers: {
						'app': 'Plants',
						'authorization': token,
						'Content-Type': 'form/multipart'
					},
					body: formData
				})
				if (!request.ok) throw new Error(String(request.status))
				data.image = undefined
				const result = (await request.json()).result
				this.user.image = new URL(result.image, process.env.imageURL)
				await this.update(data)
				return
			}
		}
		const request = await fetch(url.toJSON(), {
			method: 'PUT',
			headers: {
				'app': 'Plants',
				'authorization': token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		if (!request.ok) throw new Error(String(request.status))
		const result = (await request.json()).result
		const fieldsData = Object.keys(data)
		for (let [resultElementName, resultElementValue] of Object.entries(result)) {
			if (fieldsData.includes(resultElementName)) {
				switch (resultElementName) {
					case 'image':
						this.user.image = new URL(String(resultElementValue), process.env.imageURL)
						break;
					case 'category':
						switch (resultElementValue) {
							case 'NULL':
								this.user.category = UserCategory.NONE
								break;
							case 'BLOGGER':
								this.user.category = UserCategory.BLOGGER
								break;
							case 'COMMUNITY':
								this.user.category = UserCategory.COMMUNITY
								break;
							case 'ORGANIZATION':
								this.user.category = UserCategory.ORGANIZATION
								break;
							case 'EDITOR':
								this.user.category = UserCategory.EDITOR
								break;
							case 'WRITER':
								this.user.category = UserCategory.WRITER
								break;
							case 'GARDENER':
								this.user.category = UserCategory.GARDENER
								break;
							case 'FLOWER_MAN':
								this.user.category = UserCategory.FLOWER_MAN
								break;
							case 'PHOTOGRAPHER':
								this.user.category = UserCategory.PHOTOGRAPHER
								break;
							default:
								this.user.category = undefined
						}
						break;
					case 'gender':
						switch (resultElementValue) {
							case 'MALE':
								this.user.gender = UserGender.MALE
								break;
							case 'FEMALE':
								this.user.gender = UserGender.FEMALE
								break;
							case 'OTHER':
								this.user.gender = UserGender.OTHER
								break;
							default:
								this.user.gender = undefined
						}
						break;
					case 'birthday':
						this.user.birthday = new Date(Date.parse(String(resultElementValue)))
						break;
					case 'nickName':
						this.user.nickName = String(resultElementValue)
						break;
					case 'status':
						this.user.status = resultElementValue != null ? String(resultElementValue) : null
						break;
				}
			}
		}
		return
	}
	
	public async create(data: UserCreate): Promise<void> {
		if (this.user) throw new Error('Account User is found')
		if (this.onToken == undefined) throw new Error('Don`t can get token')
		const token = this.onToken()
		const url = new URL('/users', 'http://192.168.1.146:5000/api')
		// Костыль
		const userData = await this.getAccountData()
		if (userData?.displayName) {
			data.displayName = userData.displayName
		}
		const request = await fetch(url.toJSON(), {
			method: 'POST',
			headers: {
				'app': 'Plants',
				'authorization': token.toString(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...data, birthday: data.birthday != undefined ? data.birthday?.toISOString() : undefined })
		})
		if (!request.ok) throw new Error(String(request.status))
		const result = (await request.json()).result
		this.user = new User(result)
		if (this.nickName == undefined || this.birthday == undefined) {
			this.statusAuth = 'noRegistration'
		} else {
			this.statusAuth = 'registration'
		}
	}
	
	protected async getAccountData(): Promise<User | undefined> {
		const token = await this.onToken()
		const url = new URL(`/authentication`, 'http://192.168.1.146:5000/api')
		const request = await fetch(url.toJSON(), {
			method: 'GET',
			headers: {
				'app': 'Plants',
				'authorization': token
			}
		})
		if (!request.ok) throw new Error(String(request.status))
		const result = (await request.json()).result
		if (result == null) {
			return undefined
		} else {
			return new User(result.user_data)
		}
	}
	
	public getFirebaseAuthDataUser(): UserFirebaseData | undefined {
		const user = FirebaseAuth.getAuth().currentUser
		if (user != null) {
			return { displayName: user.displayName ?? undefined, photo: user.photoURL ?? undefined }
		}
	}
	
	public async auth(data: { type: 'google', idToken: string } | { type: 'phone', number: string }) {
		const auth = FirebaseAuth.getAuth(app)
		switch (data.type) {
			case "google":
				const googleCredential = FirebaseAuth.GoogleAuthProvider.credential(data.idToken)
				await FirebaseAuth.signInWithCredential(auth, googleCredential)
				break
			case "phone":
				break;
		}
	}
}
export const account = new Account()
