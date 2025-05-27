import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { catchError, count, map, of, tap, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1'

@Injectable({
  	providedIn: 'root'
})
export class CountryService {

	private http = inject(HttpClient)
	private queryCacheCapital = new Map<string, Country[]>()
	private queryCacheCountry = new Map<string, Country[]>()
	private queryCacheRegion = new Map<Region, Country[]>()
	private queryCacheCode = new Map<string, Country | undefined>()



	searchByCapital(query: string){
		query = query.toLowerCase()

		if(this.queryCacheCapital.has(query)){
			return of(this.queryCacheCapital.get(query) ?? [])
		}

		return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe( 
			map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
			tap((countries) => this.queryCacheCapital.set(query, countries)),
			catchError((error) => {
				console.log('Error fetching:', error);
				return throwError(() => new Error(`No se encontraron resultados para "${query}"`));
			})
		)
	}

	searchByCountry(query: string){
		query = query.toLowerCase()

		if(this.queryCacheCountry.has(query)){
			return of(this.queryCacheCountry.get(query) ?? [])
		}

		return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe( 
			map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
			tap((countries) => this.queryCacheCountry.set(query, countries)),
			catchError((error) => {
				console.log('Error fetching:', error);
				return throwError(() => new Error(`No se encontraron resultados para "${query}"`));
			})
		)
	}

	searchByRegion(region: Region){
		if(this.queryCacheRegion.has(region)){
			return of(this.queryCacheRegion.get(region) ?? [])
		}

		return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe( 
			map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
			tap((countries) => this.queryCacheRegion.set(region, countries)),
			catchError((error) => {
				console.log('Error fetching:', error);
				return throwError(() => new Error(`No se encontraron resultados para "${region}"`));
			})
		)
	}

	searchCountryByCode(code: string){
		code = code.toLowerCase()

		return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe( 
			map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
			map((countries) => countries.at(0)),
			catchError((error) => {
				console.log('Error fetching:', error);
				return throwError(() => new Error(`No se encontraron resultados para "${code}"`));
			})
		)
	}

}
