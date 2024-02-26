import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        _id: "",
        img: "",
        name: "",
        price: ""
    });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:5000/products')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error fetching products:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = () => {
        if (editingProduct) {
            axios.put(`http://localhost:5000/products/${editingProduct._id}`, newProduct)
                .then(() => {
                    setEditingProduct(null);
                    setNewProduct({
                        _id: "",
                        img: "",
                        name: "",
                        price: ""
                    });
                    fetchProducts();
                })
                .catch(error => console.error('Error updating product:', error));
        } else {
            axios.post('http://localhost:5000/products', newProduct)
                .then(() => {
                    setNewProduct({
                        _id: "",
                        img: "",
                        name: "",
                        price: ""
                    });
                    fetchProducts();
                })
                .catch(error => console.error('Error adding product:', error));
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct(product);
    };

    const handleDeleteProduct = (productId) => {
        axios.delete(`http://localhost:5000/products/${productId}`)
            .then(() => {
                fetchProducts();
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    return (
        <div>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form>
                <label>ID:</label>
                <input type="text" name="_id" value={newProduct._id} onChange={handleInputChange} />

                <label>Image URL:</label>
                <input type="text" name="img" value={newProduct.img} onChange={handleInputChange} />

                <label>Name:</label>
                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />

                <label>Price:</label>
                <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} />

                <button type="button" onClick={handleAddProduct}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
            </form>
            <h1>All Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <img src={product.img} alt={product.name} />
                        <div>{product.name}</div>
                        <div>Price: {product.price}</div>
                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}