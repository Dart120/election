import awsgi
from api.app import app  # Import the Flask app

def handler(event, context):
    """ This function will be invoked by Netlify when the function endpoint is accessed. """
    return awsgi.response(app, event, context)