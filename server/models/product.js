const pool = require('../db');

const selectAll = async () => {
    try {
      const result = await pool.query("SELECT * FROM products");
      return result.rows;
    } catch (err) {
      console.error("error", err);
      return [];
    }
};
  

class Product {
    constructor(pid, name, description, prices, size, state, photos, date) {
        this.pid = pid;
        this.name = name;
        this.prices = price;
        this.size = size;
        this.state = state;
        this.photos = photos;
        this.date = date;
        this.description = description;

        if (photos && photos.length > 0) {
            this.preview_photo = photos[0];
        }
    }

    getPid() {
        return this.pid;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getSize() {
        return this.size;
    }

    getState() {
        return this.state;
    }

    getPhotos() {
        return this.photos;
    }

   
}

module.exports = { Product };
