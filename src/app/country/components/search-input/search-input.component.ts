import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
	selector: 'country-search-input',
	imports: [],
	templateUrl: './search-input.component.html',
})
export class SearchInputComponent { 

	placeholder = input('Buscar');

	initialValue = input<string>();

	value = output<string>();

	inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

	debounceEffect = effect((onCleanup) => {
		const value = this.inputValue();
		const timeout = setTimeout(() => {
			this.value.emit(value)
		}, 500)
		onCleanup(() => {
			clearTimeout(timeout);
		})
	})
}
