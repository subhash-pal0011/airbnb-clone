const mainSchema = require('../schemas/mainSchema');
const Review = require("../schemas/reviewSchema");
const { mainSchemaJoi, ReviewJio } = require('../joiSchema');
const RoutingError = require("../HandelErrorFolder/routNotDefine");
const multer = require('multer');
const { storage } = require("../cloudinary"); 
const upload = multer({ storage });

module.exports.homePage = async (req, res) => {
       let data = await mainSchema.find();
       res.render("mainpage", { data });
}

module.exports.details = async (req, res) => {
       let { id } = req.params;
       let data = await mainSchema.findById(id).populate('review').populate('owner');
       res.render("details", { data });
}

module.exports.edit = async (req, res) => {
       let { id } = req.params;
       let data = await mainSchema.findById(id);
       res.render("edit_form", { data });
}

module.exports.update = async (req, res, next) => {
       const { error } = mainSchemaJoi.validate(req.body);
       if (error) {
              req.flash("error", "Validation failed. Please check the input characters!");
              return res.redirect("back");
       }
       const { id } = req.params;
       const upData = await mainSchema.findById(id);
       if (!upData) {
              req.flash("error", "Post not found.");
              return res.redirect("/index");
       }
       if (!upData.owner.equals(req.user._id)) {
              req.flash("error", "You are not authorized to update this post.");
              return res.redirect("/index");
       }
       const updatedData = { ...req.body }; 
       if(req.file){   
              updatedData.image = {url: req.file.path, filename: req.file.filename};
       } 
       let newUpdateData = await mainSchema.findByIdAndUpdate(id, updatedData, { new: true });
       await newUpdateData.save();
       req.flash("success", "Post updated successfully!");
       res.redirect("/index");
};



































module.exports.patanhi = async (req, res) => {
       let { id } = req.params;
       // Optional but safer: validate ObjectId
       if (!mongoose.Types.ObjectId.isValid(id)) {
              throw new RoutingError(400, "Invalid Post ID.");
       }
       let data = await mainSchema.findById(id).populate('review');
       if (!data) throw new RoutingError(404, "Post Not Found");
       res.render("details", { data });
}
module.exports.newpostSabmit = async (req, res) => {
       try {
              // Check if the file was uploaded
              if (!req.file) {
                     req.flash("error", "No file uploaded.");
                     return res.redirect("/index/newpost");
              }
              const { error } = mainSchemaJoi.validate(req.body);
              if (error) {
                     throw new RoutingError(400, "Validation failed. Please check the input characters!");
              }
              const url = req.file.path;
              const filename = req.file.filename;
              const newPost = new mainSchema({
                     ...req.body,
                     owner: req.user._id,
                     image: { url, filename }
              });
              await newPost.save();  // dhyan rhe savew karana padta hii
              req.flash("success", "Post added successfully!");
              res.redirect("/index");

       } catch (err) {
              req.flash("error", "Something went wrong while creating the post.");
              res.redirect("/index/newpost");
       }
};

module.exports.deletePost = async (req, res) => {
       let { id } = req.params;
       let findData = await mainSchema.findById(id);
       // ATHORIZATION CHECK.
       if (findData.owner.equals(req.user._id)) {  // is logic ki help se user  srverside se bhi delete nhi kr skta.
              let data = await mainSchema.findByIdAndDelete(id);
              req.flash("success", "post delete !")
              res.redirect("/index")
       }
       else {
              req.flash("error", "Hut be chutiye !");
              res.redirect("/index");
       }

}

module.exports.newReviewAdd = async (req, res) => {
       const { error } = ReviewJio.validate(req.body);
       if (error) {
              throw new RoutingError(400, "Validation failed. Please Check The Charechter!");
       }
       let { id } = req.params;
       let data1 = await mainSchema.findById(id);
       let data2 = await Review.create({ ...req.body });
       data1.review.push(data2);
       await data1.save();
       await data2.save();
       req.flash("success", "New Review Add !");
       res.redirect(`/index/${data1._id}`);
}
module.exports.reviewDelete = async (req, res) => {
       let { id, reviewid } = req.params;
       await Review.findByIdAndDelete(reviewid);
       await mainSchema.findByIdAndUpdate(id);
       req.flash("success", "Review Deleted !");
       res.redirect(`/index/${id}`);
}