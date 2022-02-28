module.exports = (sequelize, DataTypes) => {

    const Trades = sequelize.define("Trades", {
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buyer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{
        timestamps: false,
    });
    Trades.associate = (models) => {
        Trades.belongsTo(models.Auctions, {
            onDelete: "cascade",
        });
    }

    return Trades;
}