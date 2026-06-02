const registrasi = async (email, hashedPassword)=> {
    const newUser = new User({
        email: email,
        password: hashedPassword
    });
    return await newUser.save();
}


export default{registrasi}