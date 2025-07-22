const Listing = require('../models/listing.js');


module.exports.index =  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author",
  },
}).populate("owner");
  if(!listing){
     req.flash("error","Listing you requested does not exits");
     res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async(req, res,next) => {

    let url=req.file.path;
    let filename=req.file.filename;

  //  console.log(url, ".....",filename);

 
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;

  newListing.image.url=url;
  newListing.image.filename=filename;
  
  await newListing.save();
  req.flash("success","New Listing created");
  res.redirect("/listings");
  
};


module.exports.renderEditForm =async (req, res) => {
  
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
     req.flash("error","listing you are requesting does not exit!");
     req.redirect("/listings");
     
  }
  res.render("listings/edit.ejs", { listing });
}



module.exports.updateListing =async (req, res) => {
  
    let { id } = req.params;



  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if( req.file){
    // let url=req.file.path;
    // let filename=req.file.filename;
    // listing.image.url=url;
    // listing.image.filename=filename;

     listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }
 
    req.flash("success","Listing updated");
  res.redirect(`/listings/${id}`);
}




module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  //this triiger post middle ware present in listing
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}