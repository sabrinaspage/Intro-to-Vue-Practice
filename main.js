Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <a :href="imagelink"><img :src="image" :alt="birdy"/></a>
        </div>

        <div class="product-info" style="text-align: left">
            <h1> {{ title }} </h1>
            <p></p>
            <h4> {{ description }} </h4>
            <p v-if="onSale" style="color: red; font-size: 20px"> {{ discount }}</h2></p>
            <p v-if="inStock">In stock</p>
            <p v-else-if="inStock<=10 && inStock > 0">Almost sold out!</p>
            <p :disabled="!inStock"
               :class="{ crossOut: !inStock }"
               v-else>In stock</p>
            <p> Shipping: {{ shipping }}</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        
        <div v-for="(variant, index) in variants"
                :key="variant.variantID"
                class="color-box"
                :style="{ backgroundColor: variant.variantBird }"
                @mouseover="updateProduct(index)">
        </div>
        <div class="cartParent">
            <button class="Button"
                    @click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to Cart</button>

            <button class="Button"
                    @click="remfromCart"
                    :disabled="!inStock"
                    :class="{disabledButton: !inStock}">Remove to Cart</button>
        </div>


        <product-tabs>

        </product-tabs>



        <div style="position: absolute">
                <product-review @review-submitted="addReview"></product-review>
            <h2>Reviews</h2>
            <p v-if="reviews.length == 0">There are no reviews yet</p>
            <ul>
                <li v-for="review in reviews"> 
                    <p>Name: {{ review.name }}</p>
                    <p>Review: {{ review.review }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>Would recommend: {{ review.recommendation }}</p>
                </li>
            </ul>
        </div>
    </div>
    </div>`,
    data() { return {
        brand: 'Baby Gull',
        product: 'Birds',
        description: 'We hope you like birds that flock around your room! With these bad boys, you\'ll never calm down',
        selectedVariant: 0,
        imagelink: 'http://www.galleryofbirds.com/',
        birdy: 'I am bird.',
        reviews: [],
        onSale: true,
        details: ["Long feathers", "Long beaks", "Tiny"],
        variants: [
            {
                variantID: 2234,
                variantBird: "purple",
                variantQuantity: 10,
                variantImage: 'https://i.ytimg.com/vi/Zj6O8WJ3qtE/hqdefault.jpg'},
            {
                variantID: 2235,
                variantBird: "brown",
                variantQuantity: 0,
                variantImage: 'https://i.ytimg.com/vi/a_3x7MXZidM/hqdefault.jpg',
            }
        ],
        sizes: [{
            width: "2 inches",
            length: "5 inches"
        },
        {
            width: "3 inches",
            length: "7 inches"
        }],
    }},
    methods: {
            addToCart() {
                //if( this.inventory >= this.cart) {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
                //}
            },
            remfromCart() {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantID)
            },
            updateProduct(index){
                this.selectedVariant = index;
                console.log(index);
            },
            addReview(productReview){
            this.reviews.push(productReview);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        discount() {
            return this.product + ' by ' + this.brand + ' is on sale!';
        },
        shipping(){
            if(this.premium){
                return "free"
            } else {
                return "$5.99"
            }
        },
    },
})

Vue.component('product-review', {
    template: `<form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length"></p>
        <b> Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors" style="color: red;"> {{ error }} <p></p></li>
        </ul>
    <p>
        <label for="name">Name:</label>
        <p></p>
        <input id="name" v-model="name" size="34"></input>
    </p>
    <p>
        <label for="review">Review:</label>
        <p>
        <textarea id="review" v-model="review" style="width: 250px; height: 50px"></textarea>
    </p>
    <p>
        <label for="rating">Rating:</label>
        <p>
        <select id="rating" v-model.number="rating" style="width: 250px">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>
    <p>
        <label for="recommendation"> Would you recommend this product? </label>
        <input type="radio" v-model="recommendation" id="yes" name="yes" value="yes"> <label for="yes"> Yes </label>
        <input type="radio" v-model="recommendation" id="no" name="no" value="no"> <label for="no"> No </label>
        <input type="radio" v-model="recommendation" id="maybe" name="maybe" value="maybe"> <label for="maybe"> Maybe </label>
    </p>
    <p>
        <input type="submit" value="Submit" style="text-align: center; width: 250px;">
    </p>
</form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
        if (this.name && this.review && this.rating && this.recommendation)
           {
                let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommendation: this.recommendation
               }
               this.$emit('review-submitted', productReview)
               this.name = null
               this.review = null
               this.rating = null
               this.recommendation = null
           } else {

            if(!this.name) this.errors.push("Name required")
            if(!this.review) this.errors.push("Review required")
            if(!this.rating) this.errors.push("Rating required")
            if(!this.recommendation) this.errors.push("Recommendation required")

           }
        }
    }
})

Vue.component('product-tabs',{
    template: `
        <div>
            <span class="tab"
                  :class="{ activeTab : selectedTab === tab "
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="selectedTab = tab">
                    {{ tab }}
                  </span>
        </div>
    `,
    data(){
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({ 
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        reduceCart(id){
            if(this.cart.length > 0){
                this.cart.pop(id);
            }
        }
    }
});

//Go to List Rendering of Intro to Vue.JS Vue Mastery Course