const express = require("express");
const router = express.Router();
const { Offers, Auctions, Items, Trades} = require("../models");
const { Op } = require("sequelize");

// POST Offer for auction
router.post("/:id", async (req, res) => {

  const auctionid = req.params.id;
  const Offerprice = req.body.Price;
  const userid = req.body.UserId;
  const firstStatus = 'Not set';
  var Past = null;
  
  Past = await Offers.findAll({
    where:{
      UserId: userid,
      AuctionId: auctionid,
    }
  })
  if (Past.length > 0){
    await Offers.update({offer_price: Offerprice, offer_status: firstStatus,}, {where: {AuctionId:auctionid, UserId: userid}});
  } else {
    Offer = await Offers.create({
      offer_price: Offerprice,
      offer_status: firstStatus,
      UserId: userid,
      AuctionId: auctionid,
    });
  }

  res.json(Past);
});

// Get Users' offer history
router.get("/offerlist/:userId", async (req, res) => {

    const userId = req.params.userId;
    var step = 0;
    var len = 0;
    var OfferList = [];
  
    const placeData = (name, Current, offer, Status) =>{
      const Offerdata = {
        item_name: name,
        current: Current,
        myoffer: offer,
        status: Status,
      };
      OfferList.push(Offerdata);
    }
  
    const AuctionIDList = await Offers.findAll({
      attributes: ['AuctionId'],
      where:{ UserId: userId}
    }) // pull out every auctionid where the user placed bid
  
    len = AuctionIDList.length;
    for(step = 0; step < len; step ++){
      console.log("AuctionIDList: ", AuctionIDList[step].AuctionId);
      var Name = await Items.findAll({
        attributes: ['name'],
        where:{ AuctionId: AuctionIDList[step].AuctionId}
      })
      var Current = await Auctions.findAll({
        attributes: ['current'],
        where:{ id: AuctionIDList[step].AuctionId}
      })
      var Offerprice = await Offers.findAll({
        attributes: ['offer_price'],
        where:{ id: AuctionIDList[step].AuctionId}
      })
      var Offerstatus = await Offers.findAll({
        attributes: ['offer_status'],
        where:{ id: AuctionIDList[step].AuctionId}
      })
      placeData(Name[0].name, Current[0].current, Offerprice[0].offer_price, Offerstatus[0].offer_status );
    }
    console.log("OfferList", OfferList);
    res.json(OfferList);
  });

// GET Received offers
router.get("/received/:userId", async (req, res) => {
  const userId = req.params.userId;
  var step = 0;
  var len = 0;
  var OfferList = [];
  const okay = "Not set";

  const placeData = (name, Current, offer, Buyer, auctionid) =>{
    const Offerdata = {
      item_name: name,
      current: Current,
      offer_price: offer,
      buyer_id: Buyer,
      auction_id: auctionid,
    };
    OfferList.push(Offerdata);
  }

  const AuctionIDList = await Auctions.findAll({
    attributes: ['id'],
    where:{ UserId: userId, status: 'open',}
  }) // pull out every auctionid which user selling
  len = AuctionIDList.length;

  if (len == 0){
    res.json(OfferList);
  } else {
    for(step = 0; step < len; step ++) {
      // Get Offer status
      var Offerstatus = await Offers.findAll({
        attributes: ['offer_status'],
        where:{ AuctionId: AuctionIDList[step].id}
      })

      if(Offerstatus[step].offer_status != 'Not set'){continue;}
      // Get Item name
      var Name = await Items.findAll({
        attributes: ['name'],
        where:{ AuctionId: AuctionIDList[step].id}
      })
      // Get current price
      var Current = await Auctions.findAll({
        attributes: ['current'],
        where:{ id: AuctionIDList[step].id}
      })
      // Get Offer price & buyer id
      var Offerinfo = await Offers.findAll({
        attributes: ['offer_price', 'UserId'],
        where:{ AuctionId: AuctionIDList[step].id}
      })
      console.log(Name[0].name, Current[0].current, Offerinfo[0].offer_price, Offerinfo[0].UserId, AuctionIDList[step].id);
      placeData(Name[0].name, Current[0].current, Offerinfo[0].offer_price, Offerinfo[0].UserId, AuctionIDList[step].id);
    }
    res.json(OfferList);
  }
});

// POST Offer Accept
router.post("/offeraccept/:sellerId/:auctionId/:buyerId", async (req, res) => {
  console.log("Accept offer activated!!!\n");
  const sellerId = req.params.sellerId;
  const auctionId = req.params.auctionId;
  const buyerId = req.params.buyerId;


  const Price = await Offers.findAll({
    attributes: ['offer_price'],
    where: {
      AuctionId:auctionId
    }
  });
  // auction closed
  await Auctions.update({status: 'closed'}, {where: {id:auctionId}});
  console.log(Price[0].offer_price);
  
  // trade create
  await Trades.create({
    seller_id: sellerId,
    buyer_id: buyerId,
    price: Price[0].offer_price,
    AuctionId: auctionId
  });

  // offer accepted change declined for all
  /// getting offer id
  const Accepted_offer = await Offers.findAll({
    attributes:['id'],
    where:{
      UserId: buyerId,
      AuctionId: auctionId,
    }
  })
  const offerId = Accepted_offer[0].id;
  /// updating accepted offer
  await Offers.update({offer_status: 'Accepted'}, {where: {id:offerId}});
  /// updating current price as accepted offer 
  const Change = await Auctions.update({current: Accepted_offer[0].price}, {where: {id: auctionId}});
  console.log(Change);
  /// declined every other offer
  //await Offers.update({offer_status: NewOfferstatus2},{where: {id:{[Op.not]: offerId}, AuctionId: auctionId}});
  res.json(Change);
});

// Offer Decline
router.post("/offerdecline/:auctionId/:buyerId", async (req, res) => {
  const auctionId = req.params.auctionId;
  const buyerId = req.params.buyerId;
  const NewOfferstatus = "declined";

  // offer declined
  const Result = await Offers.update({offer_status: NewOfferstatus}, {where: {id:auctionId, UserId: buyerId}});

  console.log(Result);
  res.json(Result);
});


module.exports = router;
