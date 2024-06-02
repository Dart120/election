from flask import Flask
from postcodeToCons import return_election_data
app = Flask(__name__)

@app.route('/postcode/<string:postcode>', methods=['GET'])
def get_employee_by_id(postcode: str):
    data = return_election_data(postcode)
    print(data)
    return data
if __name__ == '__main__':
   app.run(port=5000)
