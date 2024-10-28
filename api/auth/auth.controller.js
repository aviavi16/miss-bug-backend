import { json } from "express"
import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"

export async function login (req, res){
    const {username, password } = req.body

    try{
        const user = await authService.login( username, password )
        loggerService.info( 'User login: ', user )

        const loginToken = await authService.getLoginToken(user) 

        res.cookie('loginToken', loginToken , { sameSite: 'None', secure: true })

        res.json(user)
        
    } catch (err ){
        loggerService.error(' Failed to Login ' + -err)
        res.status(401).send({err: 'Failed to Login'})
    }
}
export async function signup (req, res) {

    try {
        const { username, password, fullname } = req.body
        loggerService.debug( username )

        const account = await authService.signup( username, password , fullname)
        loggerService.debug(`auth.route (controller) - new account:` + JSON.stringify(account)  )

        const user = await authService.login( username, password )
        loggerService.info(`User signup :` ,user)  

        const loginToken = await authService.getLoginToken(user)
        res.cookie('loginToken', loginToken , { sameSite: 'None', secure: true })

        res.json(user)
    } catch (err) {
        loggerService.error(' Failed to Signup ' + err)
        res.status(401).send( err  )
    }
    
   

}

export async function logout  (req, res)  {
    try {
        res.clearCookie( 'loginToken' )
        loggerService.debug(`user logged out`)
        res.send({ msg: "Logged out succesfully" })

    } catch (err) {
        return res.status(400).send({ err: 'Failed to logout' })
    }
   

}

