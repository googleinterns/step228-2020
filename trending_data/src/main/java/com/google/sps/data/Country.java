package com.google.sps.data;

public class Country {
  private String name = "";
  private String alpha2Code = "";
  private double lat;
  private double lng;
  private static final int COUNTRY_NAME_INDEX = 0;
  private static final int COUNTRY_ALPHA_2_CODE_INDEX = 1;
  private static final int COUNTRY_LATITUDE_INDEX = 4;
  private static final int COUNTRY_LONGITUDE_INDEX = 5;
  private static final int NUMBER_OF_FIELDS = 6;
  // Given a String in this format: Country\tAlpha-2 code\tAlpha-3 code\t
  // \tNumeric code\tLatitude(average)\tLongitude(average)
  // creates the Country object which contains
  // country name , alpha-2 code and the lat,lng
  // Codes are (ISO 3166-1) codes
  public Country(String countryInfo) {
    String[] fields = parse(countryInfo);
    this.name = fields[COUNTRY_NAME_INDEX];
    this.alpha2Code = fields[COUNTRY_ALPHA_2_CODE_INDEX];
    this.lat = Double.parseDouble(fields[COUNTRY_LATITUDE_INDEX]);
    this.lng = Double.parseDouble(fields[COUNTRY_LONGITUDE_INDEX]);
  }

  public String[] parse(String countryInfo) {
    /** If countryInfo is empty, throw exception */
    if (countryInfo.isEmpty()) {
      throw new IllegalArgumentException("Country info should not be empty");
    }

    return countryInfo.split("\t");
  }
}
