package com.google.sps.data;

import java.util.ArrayList;

public class Country {
  String name = "";
  String alpha2Code = "";
  double lat;
  double lng;
  // Given a String in this format:
  // "Country","Alpha-2 code","Alpha-3 code","Numeric code","Latitude (average)","Longitude
  // (average)"
  // , creates the Country object which contains country name , alpha-2 code and the  lat,lng
  public Country(String countryInfo) {
    
    // will fail if country name has a (") inside it
    ArrayList<String> fields = parse(countryInfo);
    
    this.name = fields.get(0);
    this.alpha2Code = fields.get(1);
    this.lat = Double.parseDouble(fields.get(4));
    this.lng = Double.parseDouble(fields.get(5));
    
  }

  // gets the info out of the string in the above format
  private static ArrayList<String> parse(String countryInfo) {
    ArrayList<String> fields = new ArrayList<String>();
    // true if the index (i) is inside a pair of ("")
    boolean insideQuote = false;
    StringBuilder token = new StringBuilder();
    for (int i = 0; i < countryInfo.length(); i++) {
      if (countryInfo.charAt(i) == '"') {
        if (insideQuote) {
          fields.add(token.toString());
          token = new StringBuilder();
        }
        insideQuote = !insideQuote;
      } else if (insideQuote) {
        token.append(countryInfo.charAt(i));
      }
    }
    return fields;
  }
}
