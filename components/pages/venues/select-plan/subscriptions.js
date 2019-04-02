export const IT = [
	{
		name: 'default',
		price: 0,
		lines: [
			'Indirizzo e posizione geografica',
			'Contatti e orari di apertura',
			'Servizi disponibili',
			'Normale posizionamento nei risultati di ricerca'
		]
	},
	{
		name: 'premium_1',
		price: 39,
		lines: [
			'Le funzionalità del piano gratuito',
			'Bonus del 10% nei risultati di ricerca',
			'Visibilità ricorrente in home page'
		],
		highlight: 'Il più acquistato'
	},
	{
		name: 'premium_2',
		price: 79,
		lines: [
			'Le funzionalità del piano gratuito',
			'Bonus del 30% nei risultati di ricerca',
			'Visibilità ricorrente in home page',
			'Nasconde le attività vicine nella pagina di dettaglio'
		]
	}
]

export const GB = [
	{
		name: 'default',
		price: 0,
		lines: [
			'Indirizzo e posizione geografica',
			'Contatti e orari di apertura',
			'Servizi disponibili',
			'Normale posizionamento nei risultati di ricerca'
		]
	},
	{
		name: 'premium_1',
		price: 39,
		lines: [
			'Everything included in the free plan, plus:',
			'10% bonus in search results',
			'Recurring visibility on the home page'
		],
		highlight: 'Most popular'
	},
	{
		name: 'premium_2',
		price: 79,
		lines: [
			'Everything included in the free plan, plus:',
			'30% bonus in search results',
			'Recurring visibility on the home page',
			'Nearby venues hidden in your venue detail page'
		]
	}
]

export default { GB, IT }
