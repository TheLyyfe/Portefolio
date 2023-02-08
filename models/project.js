const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    url: {
        type: String,
        required: [true, 'Pas de prénom'],
    },
   img:{
    type: String,
    required: [true, "Pas d'image"],
   }

})

const ProjectModel = mongoose.model('Project', projectSchema);

module.exports = ProjectModel