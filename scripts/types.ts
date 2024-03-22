export type LocalProfile = {
    publicInfo: {
        MBTI: string
    }
    privateInfo: {
        personalInfo: {
            twitter: string
            name: string
        }
        matchInfo: {
            gender: boolean
            nation: string
            town: string
            age: string
            interest: string[]
        }
        matchRequest: {
            gender: boolean
            nation: string
            town: string
            age: string
            interest: string[]
        }
    }
}
