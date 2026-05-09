from langchain_core.tools import tool
import http.client
import json
from config.settings import settings

def _serper_api_call(query: str, endpoint: str, lat: float = None, lng: float = None):
    """Internal helper to make Serper API calls using http.client.
    If coordinates are provided, centers the search around them.
    """
    try:
        # Refine query with coordinates if available for hyper-local results
        search_query = f"{query} near {lat},{lng}" if lat and lng else query
        
        conn = http.client.HTTPSConnection("google.serper.dev")
        payload = json.dumps({"q": search_query})
        headers = {
            'X-API-KEY': settings.SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        conn.request("POST", f"/{endpoint}", payload, headers)
        res = conn.getresponse()
        data = res.read()
        return data.decode("utf-8")
    except Exception as e:
        return f"Error connecting to Serper.dev: {str(e)}"

@tool
def serper_search(query: str, lat: float = None, lng: float = None) -> str:
    """Search for general medical info. Pass lat/lng for locally relevant results."""
    return _serper_api_call(query, "search", lat, lng)

@tool
def serper_places(query: str, lat: float = None, lng: float = None) -> str:
    """Find local medical facilities. Pass lat/lng for pinpoint location accuracy."""
    return _serper_api_call(query, "places", lat, lng)

@tool
def serper_maps(query: str, lat: float = None, lng: float = None) -> str:
    """Get navigation/map data. Pass lat/lng to center exactly on the user."""
    return _serper_api_call(query, "maps", lat, lng)

def get_tools():
    # These tools now have proper schemas inferred from function signatures
    return [serper_search, serper_places, serper_maps]