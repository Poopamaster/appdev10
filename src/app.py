from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

books=[
    {"id":1,"title":"Harry Potter","author":"J.K. Rowling"},
    {"id":2,"title":"Book 2","author":"Author 2"},
    {"id":3,"title":"Book 3","author":"Author 3"}
]
@app.route("/")
def hello_world():
    return "<h1>Hello world</h1>"

@app.route("/books",methods=["GET"])
@cross_origin()
def get_all_books():
    return jsonify({"books":books})

@app.route("/books/<int:book_id>",methods=["GET"])
@cross_origin
def get_book(book_id):
    book =  next(( b for b in books if b["id"]==book_id ),None)
    if book:
        return jsonify(book)
    else:
        return jsonify({"error":"Book not found"}),404

@app.route("/books",methods=["POST"])
@cross_origin()
def create_book():
    data = request.get_json()
    new_book={
        "id":len(books)+1,
        "title":data["title"],
        "author":data["author"]
    }
    books.append(new_book)
    return jsonify(new_book),201

@app.route("/books/<int:book_id>",methods=["PUT"])
@cross_origin()
def update_book(book_id):
    book = next((b for b in books if b["id"]==book_id),None)
    if book:
        data = request.get_json()
        book.update(data)
        return jsonify(book)
    else:
        return jsonify({"error":"Book not found"}),404

@app.route("/books/<int:book_id>",methods=["DELETE"])
@cross_origin()
def delete_book(book_id):
    book = next((b for b in books if b["id"]==book_id),None)
    if book:
        books.remove(book)
        return jsonify({"message":"Book deleted successfully"}),200
    else:
        return jsonify({"error":"Book not found"}),404

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)