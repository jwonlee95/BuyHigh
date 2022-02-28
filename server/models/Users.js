module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cardinfo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Users.associate = (models) => {   
        Users.hasMany(models.Auctions, {
            onDelete: "cascade",
        });
        Users.hasMany(models.Bids, {
            onDelete: "cascade",
        });
        Users.hasMany(models.Offers, {
            onDelete: "cascade",
        });
      };

    return Users;
}