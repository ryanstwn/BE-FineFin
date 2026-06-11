const registrasi = async (username, email, hashedPassword)=> {
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    });
    return await newUser.save();
}


export default{registrasi}