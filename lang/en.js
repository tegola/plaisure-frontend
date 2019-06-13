export default {
	// Common -----------------------------------------------------------------
	common: {
		weekdays: {
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			saturday: 'Saturday',
			sunday: 'Sunday'
		},
		status: {
			error: 'Error',
			loading: 'Loading',
			offline: "Attention: you're not connected to the internet!",
			invalid_form: 'There are errors in the form. Please review your entry.',
			load_error: 'There was an error while loading data. Please try again.',
			save_error:
				'There was an error while trying saving data. Please try again.'
		},
		actions: {
			add: 'Add',
			edit: 'Edit',
			cancel: 'Cancel',
			save: 'Save',
			delete: 'Delete',
			remove: 'Remove',
			select: 'Select',
			continue: 'Continue',
			close: 'Close'
		},
		cookie: {
			agree: 'By using this website, you agree to our {policy_link}',
			link: 'cookie policy'
		}
	},

	// Components -------------------------------------------------------------
	components: {
		navbar: {
			search: 'Search...',
			home: 'Home',
			login: 'Sign in',
			register: 'Register',
			promote: 'Promote your venue',
			company: 'Company & Contact',
			responsible: 'Responsible playing'
		},

		lightbox: {
			previous: 'Previous',
			next: 'Next',
			close: 'Close',
			counter: '{current} of {total}'
		},

		no_items: {
			title: 'No items found'
		},

		footer: {
			search: 'Search venues',
			promote: 'Promote your venue',
			about: 'About us',
			responsible_gaming: 'Play responsibly',
			copyright: 'Copyright {year} {company}',
			vat: 'VAT {number}'
		},

		venue_item: {
			highlight: {
				new: 'New!',
				open: 'Open now!'
			}
		},

		subscription_card: {
			price: '{currency}{price}/month',
			highlight: 'Most popular',
			perks: {
				presence: 'Get more visibility for your business',
				details: 'Add photos, business hours and amenities',
				list: 'List your venue in the search results',
				as_free: 'All the perks of the free plan, plus:',
				distance_bonus: '{amount}% bonus in search results',
				home_page_presence: 'Recurrent presence on the home page',
				hide_nearby_venues: "Hide nearby venues in your business's page"
			},
			cancelled: {
				line1: 'Cancelled on {cancelDate}.',
				line2: 'Will work until {endDate}.'
			}
		}
	},

	// Pages ------------------------------------------------------------------
	pages: {
		home: {
			search: {
				title: 'Find the best games rooms near you.',
				subtitle:
					"It's easy with {name}, and with thousands of venues available, you're spoilt for choice!",
				label: 'Search',
				city_placeholder: 'Enter your city',
				location_placeholder: 'Near you',
				location: 'Use your current location',
				location_error: "We couldn't find your location.",
				submit: 'Search'
			},
			venue: {
				hint: 'Show your venue here'
			},
			explore: {
				title: 'Explore'
			},
			highlights: {
				title: 'Highlights'
			},
			new: {
				title: 'New'
			},
			promote: {
				intro: 'Excuse the pun',
				title: 'Get in the game',
				paragraph:
					"Add your venue or claim and manage an existing one. It's fast, and best of all, it's free!",
				register: 'Register as owner',
				add: 'Add your venue',
				manage: 'Manage your venues',
				more: 'Learn more'
			}
		},

		login: {
			meta_title: 'Sign in',
			title: 'Sign in',
			intro: 'Type your e-mail and password to sign in to {name}',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Type your password.',
			submit: 'Sign in',
			submit_error: 'Incorrect e-mail or password.',
			forgot: 'Forgot password?',
			register1: 'Not registered yet? {link}',
			register2: 'Register now!'
		},

		register: {
			owner: {
				meta_title: 'Register as owner',
				title: 'Register to {name} as owner',
				intro: 'You will be able to claim your venue or publish a new one.'
			},

			user: {
				meta_title: 'Register',
				title: 'Register to {name}',
				intro: 'You will be able to favorite, rate and review venues.'
			},

			name: 'Name',
			name_error: 'Type your name.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Choose a password (8 characters minimum).',
			agree1:
				'Clicking on Register you agree to our {terms_link}. Find out how we use your data by reading our {privacy_link}.',
			agree2: 'Terms of Service',
			agree3: 'Privacy policy',
			submit: 'Register',
			submit_error: 'This e-mail address has been already used.',
			login1: 'Already registered? {link}',
			login2: 'Sign in'
		},

		forgot_password: {
			title: 'Reset password',
			intro:
				'Insert your e-mail address to receive a link to reset your password.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			submit: 'Send link',
			submit_success:
				'Done! If this e-mail address is a valid account you will get a message with a link to reset your password.'
		},

		reset_password: {
			title: 'Reset password',
			intro: 'Set a new password for your account.',
			email: 'E-mail address',
			email_error: 'Type your e-email address.',
			password: 'Password',
			password_error: 'Choose a password (8 characters minimum).',
			password_confirmation: 'Repeat password',
			password_confirmation_error: "Passwords don't match.",
			submit: 'Reset password',
			submit_error: "Your password couldn't be reset. Please try again."
		},

		explore: {
			meta_title: 'Explore',
			view: {
				list: 'Show list',
				map: 'Show map'
			},
			filters: {
				all: 'All',
				selected: 'No selection | 1 selected | {count} selected',
				category_label: 'Type',
				radius_label: 'Distance',
				amenity_label: 'Amenities'
			},
			placeholder: {
				location: 'Near you',
				in_map: 'Inside map bounds'
			},
			location: 'Use your current location',
			location_error: "We couldn't find your location.",
			results: 'No venues found | 1 result | {count} results',
			limited_results:
				'Results have been limited. Search a specific area to get more details.',
			search_area: 'Search this area',
			no_items: {
				title: 'No venues found',
				subtitle: 'Move to a different area or change search filters.'
			}
		},

		venue_detail: {
			subtitle: '{category} in {city}',
			gallery: {
				add: 'Add photos',
				all: 'See all'
			},
			description: 'Description',
			details: {
				title: 'Details',
				concessionaire: 'Concessionaire',
				surface_size: 'Surface size',
				vlt_machine_count: 'Slot machines',
				vlt_platforms: 'VLT platforms',
				awp_machine_count: 'AWP machines',
				arcade_roulette: 'Roulette',
				online_casino: 'Online casino',
				sports_betting: 'Sports betting',
				virtual_betting: 'Virtual betting',
				horse_betting: 'Horse betting',
				parking_capacity: 'Parking spots',
				seating_capacity: 'Seatings'
			},
			amenities: {
				title: 'Amenities',
				atm: 'ATM',
				bar: 'Bar',
				pay_per_view: 'Pay Per View',
				pos: 'POS',
				private_parking: 'Private parking spots',
				restaurant: 'Restaurant',
				security: 'Security',
				smoking_area: 'Smoking area',
				wifi: 'Wi-Fi'
			},
			card: {
				directions: 'Get directions',
				closed: 'Closed',
				open_now: 'Open now',
				closed_now: 'Closed',
				no_hours: 'No business hours info',
				no_contact: 'No contact info',
				no_urls: 'No site or social network profile'
			},
			claim: {
				title: 'Is this your venue?',
				intro:
					"If you're the owner of this venue, you can claim it for free and keep it updated, add photos, jackpots, and more.",
				more: 'More info',
				action: 'Claim this venue'
				// subject: 'Claim venue: {name} (id: {id})'
			},
			issues: {
				title: 'Found an error?',
				intro:
					'If the address is incorrect, the venue has shut down, or if there are offensive photos, you can {report}.',
				report: 'report this venue',
				subject: 'Report: {name} (id: {id})'
			},
			nearby: 'Venues nearby',
			common: {
				edit: 'edit',
				unknown: 'unknown',
				yes: 'Yes',
				no: 'No'
			}
		},

		venue_claim: {
			meta_title: 'Claim venue: {name}',
			title: 'Claim venue',
			intro:
				"You're about to claim the following venue, which is not managed by anybody. It will be assigned to you and you'll be able to edit its data.",
			continue_code:
				"To continue, please type the venue's census code as registered with AAMS:",
			continue_nocode: 'To continue, please click “Continue”.',
			code: 'AAMS census code',
			code_placeholder: 'AAMS census code',
			code_error: 'Type the AAMS census code.',
			submit: 'Continue',
			submit_error: 'The code entered is incorrect.',
			back: 'Go back to the venue',
			infobox: {
				title: "It's free!",
				body:
					'Managing a venue is completely free. If you wish, you will be able subscribe to pay a monthly subscription to promote it.',
				action: 'Learn more'
			}
		},

		venue_form: {
			title: {
				add: 'Add venue',
				edit: 'Edit venue'
			},
			general: {
				title: 'General info',
				name: 'Name',
				name_placeholder: 'Ex.: Las Vegas Casino',
				name_error: 'Type the venue name.',
				concessionaire: 'Concessionaire',
				concessionaire_none: 'None',
				description: 'Description',
				surface_size: 'Surface size',
				surface_size_unit: 'm²',
				surface_size_error: "Insert the venue's surface size.",
				category: 'Category',
				category_error: 'Pick at least a category.',
				address: 'Address',
				address_line1_placeholder: 'Line 1',
				address_line2_placeholder: 'Line 2',
				address_error: 'Fill in all address data.',
				city: 'City',
				zipcode_province: 'Zip code & province',
				zipcode_placeholder: 'Zip code',
				province_placeholder: 'Province',
				country: 'Country',
				location: 'Location',
				location_searching: 'Searching',
				location_hint: 'Drag to reposition'
			},
			services: {
				title: 'Services',
				invalid_value: 'Invalid value.',
				sports_betting: 'Sports betting',
				virtual_betting: 'Virtual betting',
				horse_betting: 'Horse betting',
				arcade_roulette: 'Roulette',
				vlt_machine_count: 'Slot machines',
				awp_machine_count: 'AWP machines',
				seating_capacity: 'Seatings',
				parking_capacity: 'Parking spots',
				vlt_platforms: 'VLT platforms',
				amenities: {
					title: 'Amenities',
					atm: 'ATM',
					bar: 'Bar',
					pay_per_view: 'Pay Per View',
					pos: 'POS',
					private_parking: 'Private parking spots',
					restaurant: 'Restaurant',
					security: 'Security',
					smoking_area: 'Smoking area',
					wifi: 'Wi-Fi'
				}
			},
			contacts: {
				title: 'Contacts',
				phone: 'Phone number',
				email: 'E-mail',
				email_placeholder: 'Ex.: name@gmail.com',
				email_error: 'Type a valid e-mail address.',
				url_placeholder: 'http://',
				url_error: "Type a valid URL, starting with 'http://' or 'https://'.",
				site: 'Website URL',
				online_casino: 'Online casino',
				facebook: 'Facebook page'
			},
			hours: {
				title: 'Business hours',
				always: 'Always open (24h)',
				full: 'All day',
				split: 'Split hours',
				closed: 'Closed',
				from_to: 'From/to',
				morning: 'Morning (from/to)',
				afternoon: 'Afternoon (from/to)'
			},
			photos: {
				title: 'Photos',
				upload: 'Upload photo',
				delete: {
					title: 'Delete photo',
					intro:
						'Do you want to {action}?. It will be removed from the gallery but will be really deleted only once you save this venue.',
					intro_action: 'delete this photo'
				}
			},
			jackpots: {
				title: 'Jackpots',
				name: 'Jackpot {number}',
				name_placeholder: 'Name',
				amount_placeholder: 'Amount'
			}
		},

		venue_plan: {
			title: 'Select plan',
			selected_free:
				'You selected the free plan. This will deactivate your current subscription and your credit card will not be charged anymore. The subscription will keep working till the end of the period, on {date}.',
			selected_paid: 'You selected a paid plan.',
			selected_paid_input_data:
				'Please insert you billing information and payment method.',
			selected_paid_review_data:
				'Make sure your billing information and payment method are up to date.',
			billing: {
				title: 'Billing',
				current: 'Use the currently registered billing address',
				new: 'Use a new address',
				new_warning: {
					message:
						'{warning} if you have an active subscription on your other venues, they will be updated to use the new billing information.',
					warning: 'Warning:'
				},
				legal_name: 'Legal name',
				legal_name_error: 'Please type your company legal name.',
				address: 'Address',
				address_error: 'Please type the address.',
				postcode: 'Postal code',
				postcode_error: 'Please type the postal code.',
				city: 'City',
				city_error: 'Please type the city name.',
				region: 'Region',
				region_error: 'Please type the region.',
				country: 'Country',
				country_error: 'Please select the country.',
				vat_number: 'VAT number',
				vat_number_error: 'Please type the VAT number.'
			},
			payment: {
				title: 'Payment method',
				current: 'Use the currently registered credit card',
				new: 'Use a new credit card',
				new_warning: {
					message:
						'{warning} if you have an active subscription on your other venues, they will be updated to use the new payment method.',
					warning: 'Warning:'
				},
				card: 'Credit card',
				card_expiration: 'Expiration date',
				card_holder_name: 'Card holder name',
				card_holder_name_error:
					'Please type the card holder name as shown on the card itself'
			},
			cancel: 'Cancel subscription',
			confirm: {
				title: 'Confirm subscription',
				paragraph1:
					'This is a continuous subscription. By clicking {confirm}, you authorise {name} to charge you the subscription cost monthly (currently {currency} {price}/month). You can cancel at any time.',
				paragraph2:
					"By continuing, you agree to the {name}'s {tos} and {privacy}. You also agree that your purchase will be available immediately and that you waive your statutory right of withdrawal.",
				paragraph2_tos: 'Terms of Service',
				paragraph2_privacy: 'Privacy policy',
				submit: 'Confirm subscription'
			},
			form_error:
				'Looks like the form is incomplete: please fill out all required fields before continuing.',
			submit_error:
				'There was an error while trying to setup your subscription. The support team has already been informed. Please try again later.',
			subscription_success: {
				title: 'Subscription successful',
				message:
					'You subscription has been activated. It will renew automatically on {date}, unless you cancel it before that date.'
			},
			cancellation_success: {
				title: 'Subscription cancelled',
				message:
					"You subscription has been cancelled. It will remain active until {date}. You won't be charged again."
			}
		},

		user_info: {
			title: 'Personal information',
			name: 'Name',
			name_error: 'Please type your name.',
			name_hint:
				'Shown on your venue reviews and on messages and/or notifications you may receive from {name}.',
			email: 'E-mail address',
			newsletter: 'Keep me informed with new features and deals',
			locale: 'Language and region',
			locale_error: 'Please select your preferred language and region'
		},

		user_venues: {
			title: 'Manage your venues',
			intro_first: 'Start by adding your first venue.',
			intro_edit: 'Click one of them to edit.',
			add_first: 'Add your first venue',
			add_another: 'Add another venue'
		},

		user_billing: {
			title: 'Billing information',
			intro: 'Will be used to generate all your invoices.',
			legal_name: 'Legal name',
			legal_name_error: 'Please type your company legal name.',
			address: 'Address',
			address_error: 'Please type the address.',
			postcode: 'Postal code',
			postcode_error: 'Please type the postal code.',
			city: 'City',
			city_error: 'Please type the city name.',
			region: 'Region',
			region_error: 'Please type the region.',
			country: 'Country',
			country_error: 'Please select the country.',
			vat_number: 'VAT number',
			vat_number_error: 'Please type the VAT number.'
		},

		user_favorites: {
			title: 'Manage favorites',
			no_items: {
				title: 'No favorites saved',
				subtitle: 'You can add a favorite anytime while browsing the site.'
			}
		},

		user_password: {
			title: 'Change password',
			intro: 'Type a new password below to change it.',
			password: 'New password',
			password_hint: 'At least 8 chars, letters and numbers',
			password_error: 'Please type at least 8 chars, letters and numbers.',
			password_confirmation: 'Repeat password',
			password_confirmation_error: "Passwords don't match.",
			submit: 'Change password',
			submit_success_title: 'Password changed',
			submit_success_text: 'Your password has been changed successfully.'
		},

		promote: {
			meta_title: 'Promote your venue',
			hero: {
				title: "Promote your venue, it's free!",
				paragraph:
					'Are you the owner of a game-related business looking for new ways to promote it? Your venue is already listed on {name} and you would like to show more information to visitors? In both cases, {strong}',
				paragraph_strong: "you're in the right place!"
			},
			example: {
				paragraph1:
					'Adding your business or claiming an existing venue will allow you to reach to future clients by just adding basic information like business hours, photos, machine count and machine types, benefits, venue description and more.',
				paragraph2:
					'Here you an example venue with additional information, like photos {1}, custom jackpots {2}, details and services {3}, and contact information {4}.',
				paragraph3:
					"The more the information, the more you'll gather visitors. For example, displaying the business hours allows night owls to know if your venue is open in less canon hours.",
				paragraph4:
					'{name} is often consulted by players that are looking where to spend their free time, and they could be choosing your place!'
			},
			cost: {
				title: 'How much will it cost?',
				paragraph1:
					"Absolutely nothing! {name} provides different plans: {strong}; you won't spend anything except a little time.",
				paragraph1_strong:
					'adding a venue or claiming it to add basic information is completely free',
				paragraph2:
					"Once in {name}'s catalog, you may choose to highlight your business and make it easier to find by simply buying a monthly subscription which you could disable anytime. No hidden costs!"
			},
			start: {
				title: 'What are you waiting? Start now!',
				paragraph1:
					"If you're still doubtful, you really shouldn't. Adding or claiming your venue will only bring benefits. You will be able to customize your business' presence on {name} and autonomously update its information.",
				paragraph2:
					"If you already found your business on {name}, click on “{strong}” in the business detail page to continue. If you haven't already, you will need to register.",
				paragraph2_strong: 'Claim this venue'
			},
			manage: 'Manage your venue',
			register: 'Register as owner now'
		},

		about: {
			meta_title: 'About & Contact',
			company: {
				title: 'About {name}',
				paragraph1:
					"{name} è una startup che combina le capacità tecnologiche di web e di design da un lato, e l'esperienza nel settore gioco a livello italiano e mondiale dall'altro.", // FIXME
				paragraph2:
					'Nel panorama mondiale del settore gioco mancava un servizio come {name}, dove si fanno incontrare i due attori della filiera — chi cerca e chi offre gioco lecito — garantendo un livello sempre più alto per gli ospiti delle case da gioco, che potranno scegliere, anche attraverso {name}, dove passare il proprio prezioso tempo libero.', // FIXME
				paragraph3:
					"L'utente potrà consultare tutte le informazioni come ad esempio il numero di macchine, la tipologia di slot machines e VLT, di giochi live, gli orari di apertura, la ristorazione, le scommesse, ecc., i benefit e gli eventi che la sala da gioco ha da offrire.", // FIXME
				paragraph4:
					'Il gestore, attraverso {name}, potrà comunicare con potenziali clienti con una semplicità senza precedenti nel settore gioco.', // FIXME
				paragraph5:
					"{name} è sensibile al gioco responsabile dando una visibilità preferenziale alle case da gioco sicure e con personale qualificato con attestati di frequenza a corsi per contrastare il Gioco d'Azzardo Patologico (GAP)." // FIXME
			},
			contact: {
				title: 'Contact us',
				intro:
					"Drop us a line at one of the email addresses below. We'll do our best to reply as soon as possible.",
				info: 'For generic information:',
				help:
					'To receive support for managing your account, venue or subscription:',
				report: 'To report an issue:'
			}
		},

		play_responsibly: {
			meta_title: 'Play responsibly'
		},

		error: {
			not_found: 'Page not found',
			server_error: 'Server error'
		}
	},

	// Data -------------------------------------------------------------------
	data: {
		subscriptions: {
			default: 'Free',
			silver: 'Silver',
			gold: 'Gold'
		},
		categories: {
			adult_gaming_center: 'Adult gaming centre',
			betting_shop: 'Betting shop',
			bingo: 'Bingo hall',
			family_entertainment_center: 'Family entertainment centre',
			vlt: 'VLT game room'
		},
		amenities: {
			atm: 'ATM',
			bar: 'Bar',
			pay_per_view: 'Pay Per View',
			pos: 'POS',
			private_parking: 'Private parking spots',
			restaurant: 'Restaurant',
			security: 'Security',
			smoking_area: 'Smoking area',
			wifi: 'Wi-Fi'
		}
	}
}
