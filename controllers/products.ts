import { Product } from '../types.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'

let products: Product[] = [
	{
		id: "1",
		name: "Product 1",
		price: 30,
	},
	{
		id: "2",
		name: "Product 2",
		price: 40,
	},
	{
		id: "3",
		name: "Product 3",
		price: 60,
	},
	];   

// @route GET /api/products
const getProducts = ({ response } : { response: any }) => {
	response.body =  {
		success: true,
		data: products
	}
}

// @route GET /api/products/:id
const getProduct = ({ params, response } : { params: { id: string }, response: any }) => { 
	const product: Product | undefined = products.find(p => p.id === params.id)
	if (product) {
		response.status = 200
		response.body = {
			success: true,
			data: product
		}
	} else {
		response.status = 404
		response.body = {
			success: false,
			msg: 'No product found'
		}
	}
}

// @route POST /api/products
const addProduct = async ({ request, response } : { request: any, response: any }) => { 
	const body = await request.body()
	if (!request.hasBody) {
		response.status = 400
		response.body = {
			success: false,
			msg: 'No data'
		}
	} else {
		const product: Product = body.value
		product.id = v4.generate()
		products.push(product)
		
		response.status = 201
		response.body = {
			success: true,
			data: product
		}		
	}	
}

// @route PUT /api/products/:id
const updateProduct = async ({ params, request, response } : { params: { id: string }, request: any, response: any }) => {
	const product: Product | undefined = products.find(p => p.id === params.id)
	if (product) {
		const body = await request.body()
		const updateData: { name?: string; price?: number } = body.value
		products = products.map(p => p.id === params.id ? {...p, ...updateData } : p)
		
		response.status = 200
		response.body = {
			success: true,
			data: products
		}

	} else {
		response.status = 404
		response.body = {
			success: false,
			msg: 'No product found'
		}
	}
}

// @route DELETE /api/products/:id
const deleteProduct = ({ params, response } : { params: { id: string }, response: any }) => {
	products = products.filter(p => p.id !== params.id)
	response.body = {
		success: true,
		data: products
	}
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }
