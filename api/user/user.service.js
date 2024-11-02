import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save,
    getEmptyUser,
}

const users = utilService.readJsonFile('./data/user.json')
const PAGE_SIZE = 2

async function query(filterBy = {}) {
    const filteredUsers = [...users]
    try {
        if (filterBy.search) {

            let { search } = filterBy
            const regExp= new RegExp(search, 'i');

            filteredUsers = filteredUsers.filter(user => regExp.test(user?.username))
        }

        if (filterBy.sortBy) {
            let { sortBy } = filterBy
            switch (sortBy) {
                case 'password':
                    filteredUsers = filteredUsers.sort((user1, user2) =>
                        (user1.password - user2.password))
                case 'score&sortDir=-1':
                    filteredUsers = filteredUsers.sort((user1, user2) =>
                        (user2.score - user1.score))
                case 'username':
                default:
                    filteredUsers.sort((user1, user2) => user1.username.localeCompare(user2.username, undefined, { sensitivity: 'accent' }))
            }

        }

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredUsers = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return filteredUsers
    } catch (err) {
        loggerService.error('Could not get users', err)
        throw new Error('Could not get users')
    }
}

async function getById(userId) {
    try {
        let user = users.find(user => user._id === userId)
        if (!user) throw new Error(`User not found by userId : ${userId}`)
        user = { ...user }
        delete user.password
        return user
    } catch (err) {
        loggerService.error(`Could not get user: ${userId}`, err)
        throw new Error("Could not get user")
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch (err) {
        loggerService.error(`Could not get user by username: ${username}`, err)
        throw new Error("Could not get user by username")
    }
}

async function remove(userId) {
    try {
        const userIndex = users.findIndex(user => user._id === userId)
        if (userIndex === -1) throw new Error(`Could not remove user: ${userId}`)
        users.splice(userIndex, 1)

        await _saveUsers()
    } catch (err) {
        loggerService.error(`Could not remove user : ${userId}`, err)
        throw new Error("Could not remove user")
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            users[idx].severity = userToSave.severity
            users[idx].fullname = userToSave.fullname
        } else {
            const { username, password, fullname } = userToSave
            userToSave = userService.getEmptyUser()
            userToSave.username = username
            userToSave.password = password
            userToSave.fullname = fullname
            userToSave.createdAt = Date.now()
            userToSave.img = 'https://static8.depositphotos.com/1007989/894/i/450/depositphotos_8943042-stock-photo-okay-smiley.jpg'
            userToSave.score = 10000

            users.push(userToSave)
        }
        await _saveUsers()
    } catch (err) {
        loggerService.error(`Could not save user`, err)
        throw new Error("Could not save user")

    }
    return userToSave
}

async function _saveUsers() {
    try {
        utilService.writeJsonFile('./data/user.json', users)
    } catch (err) {
        loggerService.error(`Could not write users to json file`)
    }
}

function getEmptyUser() {
    try {
        const emptyUser = {
            _id: utilService.makeId(),
            username: '',
            fullname: '',
            password: '',
            score: 10000,
            img: '',
            createdAt: 0,
            isAdmin: false,
        }
        return emptyUser
    } catch (err) {
        loggerService.error(`Could not get empty user`, err)
    }

}