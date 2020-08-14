package com.google.sps.data;

import java.util.ArrayList;

public class Country {
  private String name = "";
  private String alpha2Code = "";
  private double lat;
  private double lng;
  private static final int COUNTRY_NAME_INDEX = 0;
  private static final int COUNTRY_ALPHA_2_CODE_INDEX = 1;
  private static final int COUNTRY_ALPHA_3_CODE_INDEX = 2;
  private static final int COUNTRY_NUMERIC_CODE_INDEX = 3;
  private static final int COUNTRY_LATITUDE_INDEX = 4;
  private static final int COUNTRY_LONGITUDE_INDEX = 5;
  // Given a String in this format:
  // "Country","Alpha-2 code","Alpha-3 code","Numeric code","Latitude (average)","Longitude
  // (average)"
  // , creates the Country object which contains country name , alpha-2 code and the  lat,lng
  // Codes are (ISO 3166-1) codes
  public Country(String countryInfo) {

    // will fail if country name has a (") inside it
    ArrayList<String> fields = parse(countryInfo);

    this.name = fields.get(COUNTRY_NAME_INDEX);
    this.alpha2Code = fields.get(COUNTRY_ALPHA_2_CODE_INDEX);
    this.lat = Double.parseDouble(fields.get(COUNTRY_LATITUDE_INDEX));
    this.lng = Double.parseDouble(fields.get(COUNTRY_LONGITUDE_INDEX));
  }

  // gets the info out of the string in the above format
  // splitting on (,) will not work because some country names have (,)
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
