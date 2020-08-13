package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.Country;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/countries")
public class CountryCodeServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException, FileNotFoundException {
    response.setContentType("application/json;");
    ArrayList<Country> countries = new ArrayList<Country>();
    // String csvFile = "WEB-INF/countries_codes.csv";

    BufferedReader br =
        new BufferedReader(
            new InputStreamReader(
                CountryCodeServlet.class.getResourceAsStream("/countries_codes.csv")));
    // discard headers
    br.readLine();
    // TODO: remove this 
    ArrayList<String> debug = new ArrayList<String>();
    while (br.ready()) {
      Country c = new Country(br.readLine());
      if(debug.contains(c.alpha2Code)) {
        System.out.println(c.alpha2Code);
      }
      debug.add(c.alpha2Code);
      countries.add(c);
    }
    response.getWriter().println(new Gson().toJson(countries));
  }
}
