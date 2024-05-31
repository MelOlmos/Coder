const { read } = require('fs')
const { userService } = require('../repositories/index')
const path  = require('path')
const multer = require('multer');



class UserController {
    constructor(){
        this.service = userService
    }

    getUsers = async (req,res) => {
        try {
            const users = await userService.getUsers()
            res.send(users)
        } catch (error) {
            console.log(error)
        }
    }
    
    getUser = async (req, res)=>{
        try {
            const { uid } = req.params
            const user = await userService.getUser({_id: uid})
            res.json({user})
        } catch (error) {
            res.status(500).json({error});
        }
    }
    
    createUser = async (request, responses)=>{
        try {
            const { body } = request
            const result = await userService.createUser(body)
    
            responses.send({
                status: 'success',
                result
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    
    updateUser = async (request, responses)=>{
        try {
            const { uid } = request.params
            const userToUpdate = await userService.updateUser(uid, userToUpdate)
            responses.status(200).send({
                status: 'success',
                result: userToUpdate
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    
    deleteUser = async (request, responses)=>{
        try {
            const {uid} = request.params
            const result = await userService.deleteUser({_id:uid}, {isActive: false})
            responses.send('deleted user')
        } catch (error) {
            console.log(error)
        }
    }

    changeUserRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;
        const PORT = process.env.PORT
    
        try {
          // Verifica si el usuario existe
          const user = await userService.getUser({_id: uid});
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // array de documentos requeridos
          const requiredDocuments = ['identificationFile', 'proofOfAddressFile', 'accountStatementFile'];
          //comprueba los tipos de doc subidos mediante fieldname
          const uploadedDocuments= requiredDocuments.every(doc => user.documents.some(uploadDoc => uploadDoc.documentType === doc));

          if (!uploadedDocuments && user.role == 'user') {
            return res.status(400).send(`Falta algún documento para ser premium user: <br><br> 
                'identificationFile'<br>
                'proofOfAddressFile'<br> 
                'accountStatementFile'</br><br>
                <a href="http://localhost:${PORT}/api/users/${uid}/documents">Cargar documentos</a>`) 
        }
    
          // Actualiza el rol del usuario
          user.role = role;
          await user.save();
    
          res.json({ message: 'Rol de usuario actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
        }
      }

    uploadFiles = async (req, res) => {
        const { uid } = req.params
        const { profileFile, productFile, identificationFile, 
            proofOfAddressFile, accountStatementFile } 
            = req.files
    console.log(req.files)

        try {
            // Verifica si el usuario existe
            const user = await userService.getUser({_id: uid})
            if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
            }

            if (profileFile) {
                let documentReference = path.join(__dirname,`/uploads/profiles/${profileFile[0].filename}`)
                user.documents.push({ name: profileFile[0].originalname, reference: documentReference, documentType: 'profileFile'})
            }
            if (productFile) {
                let documentReference = `/uploads/products/${productFile[0].filename}`
                user.documents.push({ name: productFile[0].originalname, reference: documentReference, documentType: 'productFile' })
            }
            if (identificationFile) {
                let documentReference = `/uploads/documents/${identificationFile[0].filename}`
                user.documents.push({ name: identificationFile[0].originalname, reference: documentReference, documentType: 'identificationFile'})
            }
            if (proofOfAddressFile) {
                let documentReference = `/uploads/documents/${proofOfAddressFile[0].filename}`
                user.documents.push({ name: proofOfAddressFile[0].originalname, reference: documentReference, documentType: 'proofOfAddressFile' })
            }
            if (accountStatementFile) {
                let documentReference = `/uploads/documents/${accountStatementFile[0].filename}`
                user.documents.push({ name: accountStatementFile[0].originalname, reference: documentReference, documentType: 'accountStatementFile' })
            }

            await user.save();
            res.send('File uploaded successfully')

        } catch (error) {
            res.send('Error'+error)   
        }
    }
}

module.exports = UserController