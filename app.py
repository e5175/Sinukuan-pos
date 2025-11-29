import json
from flask import Flask, render_template, request, jsonify  #key functions and classes

app = Flask(__name__)   #creates flask app

#Menu products and information
PRODUCTS = [
    {'id': 'DRN001', 'name': 'Ginilu', 'price': 120.00, 'category': 'Drinks', 'image_url': 'Ginilu.png'},
    {'id': 'DRN002', 'name': "Sago't Gulaman", 'price': 120.00, 'category': 'Drinks', 'image_url': 'SagoAtGulaman.png'},
    {'id': 'DRN003', 'name': "Orange Juice", 'price': 120.00, 'category': 'Drinks', 'image_url': 'OrangeJuice.png'},
    {'id': 'DRN004', 'name': "Dalandan Juice", 'price': 120.00, 'category': 'Drinks', 'image_url': 'DalandanJuice.png'},
    {'id': 'DRN005', 'name': "Calamansi Juice", 'price': 120.00, 'category': 'Drinks', 'image_url': 'CalamansiJuice.png'},
    {'id': 'DRN006', 'name': "Pipino Juice", 'price': 120.00, 'category': 'Drinks', 'image_url': 'PipinoJuice.png'},
    {'id': 'DRN007', 'name': "Buko Juice", 'price': 120.00, 'category': 'Drinks', 'image_url': 'BukoJuice.png'},
    {'id': 'DRN008', 'name': "Coke", 'price': 100.00, 'category': 'Drinks', 'image_url': 'Coke.png'},
    {'id': 'DRN009', 'name': "Coke Zero", 'price': 100.00, 'category': 'Drinks', 'image_url': 'CokeZero.png'},
    {'id': 'DRN010', 'name': "Sprite", 'price': 100.00, 'category': 'Drinks', 'image_url': 'Sprite.png'},
    {'id': 'DRN011', 'name': "Royal", 'price': 100.00, 'category': 'Drinks', 'image_url': 'Royal.png'},
    {'id': 'DRN012', 'name': "Water", 'price': 90.00, 'category': 'Drinks', 'image_url': 'Water.png'},
    {'id': 'STR001', 'name': 'Lumpiang Ubod', 'price': 199.00, 'category': 'Starters', 'image_url': 'LumpiangUbod.png'},
    {'id': 'STR002', 'name': 'Ensaladang Pako', 'price': 199.00, 'category': 'Starters', 'image_url': 'EnsaladangPako.png'},
    {'id': 'STR003', 'name': 'Biringhe', 'price': 260.00, 'category': 'Starters', 'image_url': 'Biringhe.png'},
    {'id': 'STR004', 'name': 'Camaru', 'price': 260.00, 'category': 'Starters', 'image_url': 'Camaru.png'},
    {'id': 'STR005', 'name': 'Okoy', 'price': 320.00, 'category': 'Starters', 'image_url': 'Okoy.png'},
    {'id': 'STR006', 'name': 'Taba ning Talangka Deviled Eggs', 'price': 400.00, 'category': 'Starters', 'image_url': 'TabangTalangka.png'},
    {'id': 'STR007', 'name': 'Atsara', 'price': 199.00, 'category': 'Starters', 'image_url': 'Atsara.png'},
    {'id': 'STR003', 'name': 'Suam Mais', 'price': 179.00, 'category': 'Starters', 'image_url': 'SuamMais.png'},
    {'id': 'M001', 'name': 'Sisig', 'price': 320.00, 'category': 'Main', 'image_url': 'Sisig.png'},
    {'id': 'M002', 'name': 'Pindang Damulag', 'price': 260.00, 'category': 'Main', 'image_url': 'PindangDamulag.png'},
    {'id': 'M003', 'name': 'Bulanglang', 'price': 230.00, 'category': 'Main', 'image_url': 'Bulanglang.png'},
    {'id': 'M004', 'name': 'Betute', 'price': 270.00, 'category': 'Main', 'image_url': 'Betute.png'},
    {'id': 'M006', 'name': 'Kilayin', 'price': 210.00, 'category': 'Main', 'image_url': 'Kilayin.png'},
    {'id': 'M007', 'name': 'Pulutok', 'price': 190.00, 'category': 'Main', 'image_url': 'Pulutok.png'},
    {'id': 'M008', 'name': 'Gule Magalang', 'price': 199.00, 'category': 'Main', 'image_url': 'GuleMagalang.png'},
    {'id': 'M010', 'name': 'Pesa', 'price': 210.00, 'category': 'Main', 'image_url': 'Pesa.png'},
    {'id': 'M011', 'name': 'Guiso', 'price': 250.00, 'category': 'Main', 'image_url': 'Guiso.png'},
    {'id': 'M012', 'name': 'Tidtad', 'price': 260.00, 'category': 'Main', 'image_url': 'Tidtad.png'},
    {'id': 'M013', 'name': 'Sabo Kamatis', 'price': 200.00, 'category': 'Main', 'image_url': 'SaboKamatis.png'},
    {'id': 'M014', 'name': 'Manyaman Beef Asado', 'price': 299.00, 'category': 'Main', 'image_url': 'ManyamanBeefAsado.png'},
    {'id': 'M015', 'name': 'Begucan Babi', 'price': 200.00, 'category': 'Main', 'image_url': 'BegucanBabi.png'},
    {'id': 'M016', 'name': 'Asadong Matua', 'price': 280.00, 'category': 'Main', 'image_url': 'AsadongMatua.png'},
    {'id': 'M017', 'name': 'Paksing Demonyu', 'price': 210.00, 'category': 'Main', 'image_url': 'PaksingDemonyu.png'},
    {'id': 'M018', 'name': 'Bagis', 'price': 199.00, 'category': 'Main', 'image_url': 'Bagis.png'},
    {'id': 'M019', 'name': 'Lagat Hito', 'price': 190.00, 'category': 'Main', 'image_url': 'LagatHito.png'},
    {'id': 'M020', 'name': 'Nasi (1 cup)', 'price': 80.00, 'category': 'Main', 'image_url': 'NasiCup.png'},
    {'id': 'M021', 'name': 'Nasi (1 bowl)', 'price': 200.00, 'category': 'Main', 'image_url': 'NasiBowl.png'},
    {'id': 'DES001', 'name': 'Sampelot', 'price': 110.00, 'category': 'Dessert', 'image_url': 'Sampelot.png'},
    {'id': 'DES002', 'name': 'Saging Con Yelo', 'price': 99.00, 'category': 'Dessert', 'image_url': 'SagingConYelo.png'},
    {'id': 'DES003', 'name': 'Sans Rival', 'price': 140.00, 'category': 'Dessert', 'image_url': 'SansRival.png'},
    {'id': 'DES004', 'name': 'Suman Bulagta', 'price': 60.00, 'category': 'Dessert', 'image_url': 'SumanBulagta.png'},
    {'id': 'DES005', 'name': 'Suman Tili (3-piece)', 'price': 100.00, 'category': 'Dessert', 'image_url': 'SumanTili.png'},
    {'id': 'DES006', 'name': 'Tamalis', 'price': 80.00, 'category': 'Dessert', 'image_url': 'Tamalis.png'},
    {'id': 'DES007', 'name': "Kabigting's Halo-Halo", 'price': 120.00, 'category': 'Dessert', 'image_url': 'HaloHalo.png'},
    {'id': 'DES008', 'name': 'Tibuk-tibuk', 'price': 110.00, 'category': 'Dessert', 'image_url': 'TibukTibuk.png'},
    {'id': 'DES009', 'name': 'San Nicolas Cookies', 'price': 100.00, 'category': 'Dessert', 'image_url': 'SanNicolasCookies.png'},
    {'id': 'DES010', 'name': 'Kapit', 'price': 110.00, 'category': 'Dessert', 'image_url': 'Kapit.png'},
    {'id': 'DES011', 'name': 'Plantanillas', 'price': 150.00, 'category': 'Dessert', 'image_url': 'Plantanillas.png'},
    {'id': 'DES012', 'name': 'Turrones de Casoy', 'price': 130.00, 'category': 'Dessert', 'image_url': 'TurronesDeCasoy.png'},
    {'id': 'DES013', 'name': 'Moche', 'price': 180.00, 'category': 'Dessert', 'image_url': 'Moche.png'},
    {'id': 'DES014', 'name': 'Kalame Gandus', 'price': 110.00, 'category': 'Dessert', 'image_url': 'KalameGandus.png'},
    {'id': 'DES015', 'name': 'Buko Pandan', 'price': 120.00, 'category': 'Dessert', 'image_url': 'BukoPandan.png'}
]
#map for fast lookup by the ID of each product
PRODUCT_MAP = {p['id']: p for p in PRODUCTS}

@app.route('/') #main page
def index():
    return render_template('index.html', products=PRODUCTS) #renders HTML template

@app.route('/calculate', methods=['POST'])
def calculate_total():
    try:
        cart_data = request.json    #gets JSON data of cart contents
        if not cart_data:   #checks if request has the cart ddata
            return jsonify({'error': 'No cart data provided'}), 400
        subtotal = 0.0

        for product_id, quantity in cart_data.items():  #loops through each cart data
            if product_id in PRODUCT_MAP and isinstance(quantity, int) and quantity > 0: #validates if product/s is in PRODUCT_MAP and quantity data type is int
                product = PRODUCT_MAP[product_id]   #gets the details of the product from its id
                item_price = product['price']
                subtotal += item_price * quantity   #adds the item price to the subtotal of their order
        grand_total = subtotal

        return jsonify({    #returns the total to the frontend to display
            'success': True,
            'subtotal': f"{subtotal:.2f}",
            'grand_total': f"{grand_total:.2f}"
        })

    except Exception as e:
        app.logger.error(f"Error during calculation: {e}")  #logs error
        return jsonify({'error': 'An internal server error occurred during calculation.'}), 500 #returns error message

if __name__ == '__main__':
    app.run(debug=True) #starts Flask server