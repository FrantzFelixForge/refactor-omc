class Deal {
  constructor() {
    this.issuerArray = [
      "SpaceX",
      "Postmates",
      "Robinhood",
      "DigitalOcean",
      "Coursera",
      "Netlify",
      "Kraken",
      "Airbnb",
      "Plaid",
      "JUUL",
      "Automation Anywhere",
    ];
    this.sellerArray = [
      "Confidential77",
      "Kyle",
      "Kenny",
      "Stan",
      "Eric",
      "Stephanie",
      "Melissa",
      "Candance",
      "Jean",
    ];
    this.buyerArray = [
      "Frantz",
      "Pete",
      "Naresh",
      "Nick",
      "Makeila",
      "Morgan",
      "Alicia",
      "Sarah",
      "Jevon",
    ];
    this.brokerArray = [
      "Arora",
      "Reigelsperger",
      "Rabinovich",
      "S. Gordan",
      "Illishah",
      "Lin",
      "Watson",
      "Chan",
      "Krug",
      "Saeta",
      "Stanrick",
      "Papoutsis",
      "Deyan",
      "duPont",
      "Smead",
      "Boyd",
      "Mangan",
      "Pacilio",
      "Gendels",
      "Laczkovics",
      "Mooney",
      "Rogoff",
      "Giunta",
      "P. Gordan",
      "Mace",
      "Yun",
      "Williams",
      "Frascotti",
      "Zawrotny",
      "Constantine",
      "Saliba",
    ];
    this.operationsArray = [
      //   "Alex Rabinovich",
      //   "Amar Aulakh",
      //   "Brian Coyle",
      //   "Jacob Shanklin",
      //   "Joshua Manley",
      //   "Keith Richardson",
      //   "Kelli Frostad",
      //   "Lynette Darensburg",
      //   "Makeila Blanter",
      //   "Nate Canny",
      //   "Tyler Cliggett",
      "Frantz Felix",
      "Pete Van Wesep",
      "morgan.fogarty@forgeglobal.com",
      "Naresh Sikha",
    ];
    this.dealTypeArray = [
      "Fund Direct",
      "Direct",
      "Redemption",
      "Transfer",
      //   "Forward",
    ];
    this.dealIdArray = [
      "DT22-6862-A",
      "D27-8276-A",
      "R41-4626-A",
      "T29-3989-A",
      "F21-1201-A",
    ];
    this.buyerStatusArray = [
      "Filling out CEA",
      "Filling out Fund Documents",
      "Wiring out Funds",
      "Filling out Commission Agreement",
      "Filling out Purchase Agreement",
    ];
    this.sellerStatusArray = [
      "Filling out CEA",
      "Filling out Fund Documents",
      "Waiting for Funds",
      "Filling out Commission Agreement",
      "Filling out Purchase Agreement",
    ];
    this.atypicalArray = [
      "New Issuer",
      //   "Hong Kong",
      "Offering",
      "Foreign LP Units",
      "ROFR'd",
      "Blocked",
      "SharesPost",
    ];
    this.commissionPercentage = 0.05;
    this.sharePrice = Math.floor(Math.random() * 500) + 1;
    this.shareQuantity = Math.floor(Math.random() * 25000) + 1;
    this.totalPrice = this.sharePrice * this.shareQuantity;
    this.commission = this.totalPrice * this.commissionPercentage;
    this.wireAmount = this.totalPrice + this.commission;
    this.numOfBuyers = Math.floor(Math.random() * 3) + 1;
    this.numOfSellers = Math.floor(Math.random() * 3) + 1;
  }

  static randomArrayElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomDeal() {
    const buyers = [];
    const sellers = [];
    let i = 0;
    while (i < this.numOfBuyers) {
      const currentBuyer = Deal.randomArrayElement(this.buyerArray);
      if (!buyers.includes(currentBuyer)) {
        buyers.push(currentBuyer);
        i++;
      }
    }
    i = 0;
    while (i < this.numOfSellers) {
      const currentSeller = Deal.randomArrayElement(this.sellerArray);
      if (!sellers.includes(currentSeller)) {
        sellers.push(currentSeller);
        i++;
      }
    }

    const dealInfo = {
      id: `${Deal.randomArrayElement(this.dealIdArray)}`,
      issuer: `${Deal.randomArrayElement(this.issuerArray)}`,
      broker: `${Deal.randomArrayElement(this.brokerArray)}`,
      operations: `${Deal.randomArrayElement(this.operationsArray)}`,
      buyer: buyers,
      seller: sellers,
      atypical: `${Deal.randomArrayElement(this.atypicalArray)}`,
      quantity: this.shareQuantity,
      price: this.sharePrice,
      type: `${Deal.randomArrayElement(this.dealTypeArray)}`,
      total: this.totalPrice,
      commission: this.commission,
      wireAmount: this.wireAmount,
      rofrDate: "N/A",
      buyerStatus: `${Deal.randomArrayElement(this.buyerStatusArray)}`,
      sellerStatus: `${Deal.randomArrayElement(this.sellerStatusArray)}`,
    };

    return dealInfo;
  }
}

module.exports = Deal;
