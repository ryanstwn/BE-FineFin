import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // nama: { 
    //     type: String, 
    //     required: true 
    // },
    email: { 
        type: String, 
        required: true, 
        unique: true // Mencegah 1 email dipakai 2 kali
    },
    password: { 
        type: String, 
        required: true 
    }
}, {
    // timestamps otomatis membuat field 'createdAt' dan 'updatedAt'
    timestamps: true 
});

export default mongoose.model('User', userSchema);
