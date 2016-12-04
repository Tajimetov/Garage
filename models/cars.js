module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cars', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 50]
			}
		},
		typecar: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
		},
		number: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
		}
	},
	{
		timestamps: false,
		freezeTableName: true
	}
	);
};
