package com.google.sps.data;

import java.util.ArrayList;
public class Country {
    String name = "";
    String alpha2Code = "";
    double lat;
    double lng;

    // Given a String in this format:
    // "Country","Alpha-2 code","Alpha-3 code","Numeric code","Latitude (average)","Longitude (average)"
    // , creates the Country object which contains country name , alpha-2 code and the  lat,lng
    public Country (String s) {
        // true if the index (i) is inside a pair of ("")
        // will fail if string has a (") inside a pair of ("")
        ArrayList<String> fields= new ArrayList();
        boolean insideQuote = false; 
        StringBuilder token = new StringBuilder();
        for (int i=0;i<s.length();i++) {
            if (s.charAt(i)=='"') {
                if(insideQuote) {
                    fields.add(token.toString());
                    token = new StringBuilder();
                }
                insideQuote = !insideQuote;
            } else if (insideQuote) {
                token.append(s.charAt(i));
            }
        }
        if(fields.size() == 6) {
            this.name = fields.get(0);
            this.alpha2Code = fields.get(1);
            this.lat = Double.parseDouble(fields.get(4));
            this.lng = Double.parseDouble(fields.get(5));
        }
    }
}