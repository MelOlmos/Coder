const fs = require('fs')
const crypto = require('crypto')

const path = './usuarios_test.json' // representa la persistencia datos en archivos


class UserDaoFile {    
    get = async () => {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, 'utf-8');
                const users = JSON.parse(data);
                return users;
            }
            await fs.promises.writeFile(path, '[]', 'utf-8')
            return []
            
        } catch (error) {
            console.log(error)
        }        
    }
    getBy(){}
    create = async (usuario) => {
        const users =  await this.consultarUsuarios();
        if(users.length===0){
            usuario.id=1;
        }else{
            usuario.id = users[users.length-1].id + 1;
        }
        console.log(usuario)
        usuario.salt = crypto.randomBytes(128).toString('base64')
        usuario.password = crypto.createHmac('sha256', usuario.salt).update(usuario.contrasena).digest('hex')
        
        console.log(usuario)
        users.push(usuario);
        
        await fs.promises.writeFile(path,JSON.stringify(users,null,'\t'));
        return usuario;
    }
    update(){}
    delete(){}


    validarUsuario = async(nombre,contrasena) =>{
        //leyendo el archivo
        const usuarios = await this.consultarUsuarios();

        const usuarioIndex = usuarios.findIndex(u=>u.nombre===nombre)

        if(usuarioIndex===-1) {
            console.log("error, usuario no encontrado");
            return;
        }
        const usuario = usuarios[usuarioIndex];
        const newHash = crypto.createHmac('sha256',usuario.salt).update(contrasena).digest('hex');
        
        if(newHash===usuario.password){
            console.log("Logueado");
        }else{
            console.log("Contraseña inválida");
        }
    }
}

module.exports =  UserDaoFile