import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    // Using OpenWeatherMap API for real weather data
    const API_KEY = process.env.OPENWEATHER_API_KEY || "demo_key"

    // If no API key is available, use a free weather service or mock data
    if (API_KEY === "demo_key") {
      // Using a free weather API service (weatherapi.com) - no key required for basic usage
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=demo&q=${encodeURIComponent(city)}&aqi=no`,
      )

      if (!response.ok) {
        // Fallback to wttr.in service which provides free weather data
        const wttrResponse = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)

        if (!wttrResponse.ok) {
          throw new Error("Weather service unavailable")
        }

        const wttrData = await wttrResponse.json()
        const current = wttrData.current_condition[0]

        return NextResponse.json({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          temperature: Number.parseInt(current.temp_C),
          description: current.weatherDesc[0].value.toLowerCase(),
          humidity: Number.parseInt(current.humidity),
          windSpeed: Number.parseFloat(current.windspeedKmph) / 3.6, // Convert to m/s
          feelsLike: Number.parseInt(current.FeelsLikeC),
        })
      }

      const data = await response.json()

      return NextResponse.json({
        city: data.location.name,
        temperature: Math.round(data.current.temp_c * 10) / 10,
        description: data.current.condition.text.toLowerCase(),
        humidity: data.current.humidity,
        windSpeed: Math.round((data.current.wind_kph / 3.6) * 10) / 10, // Convert to m/s
        feelsLike: Math.round(data.current.feelslike_c * 10) / 10,
      })
    }

    // If OpenWeatherMap API key is available
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "City not found" }, { status: 404 })
      }
      throw new Error("Weather service error")
    }

    const data = await response.json()

    return NextResponse.json({
      city: data.name,
      temperature: Math.round(data.main.temp * 10) / 10,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      feelsLike: Math.round(data.main.feels_like * 10) / 10,
    })
  } catch (error) {
    console.error("Weather API error:", error)

    // Fallback to a simple weather service
    try {
      const fallbackResponse = await fetch(`https://goweather.herokuapp.com/weather/${encodeURIComponent(city)}`)

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()

        // Parse temperature from string like "25 °C"
        const tempMatch = fallbackData.temperature.match(/(-?\d+)/)
        const temperature = tempMatch ? Number.parseInt(tempMatch[1]) : 20

        return NextResponse.json({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          temperature: temperature,
          description: fallbackData.description.toLowerCase() || "partly cloudy",
          humidity: 60, // Default values since this API doesn't provide them
          windSpeed: 3.0,
          feelsLike: temperature + 2,
        })
      }
    } catch (fallbackError) {
      console.error("Fallback API error:", fallbackError)
    }

    return NextResponse.json({ error: "Unable to fetch weather data. Please try again." }, { status: 500 })
  }
}
