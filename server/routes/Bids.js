const express = require("express");
const router = express.Router();
const { Bids, Auctions, Items } = require("../models");


// POST Bid for auction
router.post("/:id", async (req, res) => {
  //console.log(req);

  const Newprice = req.body.Price;
  const auctionid = req.params.id;
  const userid = req.body.UserId;
  const Newtime = req.body.Time;
  var Past = null;

  Past = await Bids.findAll({
    where:{
      UserId: userid,
      AuctionId: auctionid,
    }
  })
  console.log(Past.length);

  if (Past.length > 0){
    await Bids.update({time:Newtime, price: Newprice}, {where: {AuctionId:auctionid, UserId: userid}});
  } else {
    Bid = await Bids.create({
      price: Newprice,
      time: Newtime,
      UserId: userid,
      AuctionId: auctionid,
    });
  }
  //console.log("\n\n",Bid,"\n\n");

  Auction = await Auctions.update({current: Newprice,},{where: {id: auctionid}});
  console.log(Auction);

  res.json(Auction);
});

// Get Users' Bid history
router.get("/bidlist/:userId", async (req, res) => {

  const userId = req.params.userId;
  var step = 0;
  var len = 0;
  var BidList = [];

  const placeData = (name, Current, bid) =>{
    const Biddata = {
      item_name: name,
      current: Current,
      mybid: bid,
    };
    BidList.push(Biddata);
  }

  const AuctionIDList = await Bids.findAll({
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
    var Bidprice = await Bids.findAll({
      attributes: ['price'],
      where:{ AuctionId: AuctionIDList[step].AuctionId}
    })
    placeData(Name[0].name, Current[0].current, Bidprice[0].price );
  }
  console.log("BidList", BidList);
  res.json(BidList);
});
module.exports = router;
