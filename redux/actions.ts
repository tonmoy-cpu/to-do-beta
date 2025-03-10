import { Task } from "@/types/task";
import { Weather } from "@/types/weather";

export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const TOGGLE_TASK_COMPLETION = "TOGGLE_TASK_COMPLETION";
export const FETCH_WEATHER_SUCCESS = "FETCH_WEATHER_SUCCESS";
export const FETCH_WEATHER_FAILURE = "FETCH_WEATHER_FAILURE";
export const UPDATE_TASK = "UPDATE_TASK";
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";

export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const deleteTask = (taskId: string) => ({
  type: DELETE_TASK,
  payload: taskId,
});

export const toggleTaskCompletion = (taskId: string) => ({
  type: TOGGLE_TASK_COMPLETION,
  payload: taskId,
});

export const fetchWeatherSuccess = (location: string, weather: Weather) => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: { location, weather },
});

export const fetchWeatherFailure = (location: string, error: string) => ({
  type: FETCH_WEATHER_FAILURE,
  payload: { location, error },
});

export const updateTask = (taskId: string, updatedFields: Partial<Task>) => ({
  type: UPDATE_TASK,
  payload: { taskId, updatedFields },
});

export const login = (username: string | null) => ({
  type: LOGIN,
  payload: username,
});

export const register = (user: { username: string; password: string; avatar: string }) => ({
  type: REGISTER,
  payload: user,
});

export const fetchWeather = (location: string) => async (dispatch: any) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const weatherData: Weather = await response.json();
    dispatch(fetchWeatherSuccess(location, weatherData));
  } catch (error) {
    dispatch(fetchWeatherFailure(location, error.message));
  }
};