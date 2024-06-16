from flask import Flask, abort
from postcodeToCons import return_election_data
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/postcode/<string:postcode>', methods=['GET'])
def get_employee_by_id(postcode: str):
    try:
        data = return_election_data(postcode)
    except:
        return abort(404)

    return data
@app.route('/', methods=['GET'])
def main():

    return "Hello World"
if __name__ == '__main__':
   app.run(port=5000)
