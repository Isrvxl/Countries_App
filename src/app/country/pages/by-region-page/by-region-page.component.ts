import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { Region } from '../../interfaces/region.type';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region {

	queryParam = queryParam.toLowerCase();

	const validRegions: Record<string, Region> = {
		'africa': 'Africa',
		'americas': 'Americas',
		'asia': 'Asia',
		'europe': 'Europe',
		'oceania': 'Oceania',
		'antarctic': 'Antarctic',
	}

	return validRegions[queryParam] ?? null
}

@Component({
	selector: 'app-by-region-page',
	imports: [CountryListComponent],
	templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {

	public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']

	activatedRoute = inject(ActivatedRoute)

	router = inject(Router)

	queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? ''

	selectedRegion = linkedSignal<Region>(() => validateQueryParam(this.queryParam))

	countryService = inject(CountryService);

	regionResource = rxResource({
		request: () => ({ region: this.selectedRegion() }),
		loader: ({ request }) => {
			if (!request.region) return of([])

			this.router.navigate(['/country/by-region'], {
				queryParams: { region: request.region },
			})

			return this.countryService.searchByRegion(request.region)	
		}
	})

}
