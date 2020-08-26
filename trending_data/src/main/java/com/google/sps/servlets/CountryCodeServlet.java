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

    BufferedReader br =
        new BufferedReader(
            new InputStreamReader(
                CountryCodeServlet.class.getResourceAsStream("/countries_codes.tsv")));

    while (br.ready()) {
      countries.add(new Country(br.readLine()));
    }
    response.getWriter().println(new Gson().toJson(countries));
  }
}
