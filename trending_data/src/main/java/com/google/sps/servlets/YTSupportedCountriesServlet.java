package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/yt-supported-countries")
public class YTSupportedCountriesServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    ArrayList<String> ytSupportedCountries =
        YTSupportedCountriesSearch.getSupportedCountries(); // codes of countries supported by YT

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(ytSupportedCountries));
  }
}
