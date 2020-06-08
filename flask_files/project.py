import json
import requests
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
base_link = str("http://flaskosa.herokuapp.com/cmd/")
trace_end_point = "TRACE"

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/', methods=['GET'])
@cross_origin()
def index():
	return "Hello! Lets trace the data"

@app.route('/api/trace', methods=['GET'])
@cross_origin()
def search_text():
	try:
		url_hit_data = requests.get(str(base_link + trace_end_point))
		response_data = json.loads(url_hit_data.content)
		return jsonify({'code': '200', 'data': response_data}), 200
	except Exception:
		return jsonify({'code': '200', 'data': "Invalid Data"}), 200

@app.route('/api/query', methods=['POST'])
@cross_origin()
def get_data_for_query():
	request_data = request.json
	query_string = request_data['query']
	if request.method == 'POST':
		url_hit_data = requests.get(base_link + str(query_string.upper()))
	return jsonify({'code': '200', 'data': url_hit_data.text}), 200

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=5000, debug=True)
