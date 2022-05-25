const axios = require("axios");

exports.handler = async function (context, event, callback) {
  const from = event.From || "+61467601932";
  const response = new Twilio.Response();

  const ax = axios.create({
    baseURL: context.AIRTABLE_URL,
    headers: { Authorization: "Bearer " + context.AIRTABLE_APIKEY },
  });

  try {
    const air_response = await ax.get("/Prospects");
    const records = air_response.data.records;
    //    console.log("Airtable records", records);
    records.forEach((record) => {
      if (record.fields.Phone && record.fields.Phone == from) {
        callback(null, record.fields);
        return;
      }
    });

    response.setStatusCode(404);
    callback(null, response);
  } catch (err) {
    response.setStatusCode(500);
    callback(err, response);
  }
};
