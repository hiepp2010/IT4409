const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('backend', 'username', 'password', {
  host: 'winhost',
  port: 3306,
  dialect: 'mysql'
});

// Define models
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false });

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.BIGINT,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, { timestamps: false });

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  discountedPrice: {
    type: DataTypes.FLOAT
  },
  subcategoryId: {
    type: DataTypes.BIGINT,
    references: {
      model: SubCategory,
      key: 'id'
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false });

const Color = sequelize.define('Color', {
  productId: {
    type: DataTypes.BIGINT,
    references: {
      model: Product,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  }
}, { timestamps: false });

const Size = sequelize.define('Size', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  colorId: {
    type: DataTypes.BIGINT,
    references: {
      model: Color,
      key: 'id'
    }
  }
}, { timestamps: false });

const ImagePath = sequelize.define('ImagePath', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  colorId: {
    type: DataTypes.BIGINT,
    references: {
      model: Color,
      key: 'id'
    }
  }
}, { timestamps: false });

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false });

const UserInfo = sequelize.define('UserInfo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    references: {
      model: User,
      key: 'id'
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false });

const OrderHistory = sequelize.define('OrderHistory', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    references: {
      model: User,
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: true });

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  orderHistoryId: {
    type: DataTypes.BIGINT,
    references: {
      model: OrderHistory,
      key: 'id'
    }
  },
  colorId: {
    type: DataTypes.BIGINT,
    references: {
      model: Color,
      key: 'id'
    }
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, { timestamps: false });

// Establish relationships
Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

SubCategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' });
Product.belongsTo(SubCategory, { foreignKey: 'subcategoryId', as: 'subCategory' });

Product.hasMany(Color, { foreignKey: 'productId', as: 'colors' });
Color.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Color.hasMany(Size, { foreignKey: 'colorId', as: 'sizes' });
Size.belongsTo(Color, { foreignKey: 'colorId', as: 'color' });

Color.hasMany(ImagePath, { foreignKey: 'colorId', as: 'imagePaths' });
ImagePath.belongsTo(Color, { foreignKey: 'colorId', as: 'color' });

User.hasOne(UserInfo, { foreignKey: 'userId', as: 'userInfo' });
UserInfo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(OrderHistory, { foreignKey: 'userId', as: 'orderHistory' });
OrderHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

OrderHistory.hasMany(OrderItem, { foreignKey: 'orderHistoryId', as: 'orderItems' });
OrderItem.belongsTo(OrderHistory, { foreignKey: 'orderHistoryId', as: 'orderHistory' });

Color.hasMany(OrderItem, { foreignKey: 'colorId', as: 'orderItems' });
OrderItem.belongsTo(Color, { foreignKey: 'colorId', as: 'color' });

// Sync models with the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true }); // Force sync for demonstration, should be used cautiously
    console.log('Database synchronized with models');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = {
  Category,
  SubCategory,
  Product,
  Color,
  Size,
  ImagePath,
  User,
  UserInfo,
  OrderHistory,
  OrderItem,
  sequelize
};

console.log('Sequelize configuration updated successfully.');
