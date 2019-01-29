/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.web.api;

import java.util.Collection;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.model.Specialty;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 */
@RestController
public class VetResource extends AbstractResourceController {

	private final ClinicService clinicService;

	@Autowired
	public VetResource(ClinicService clinicService) {
		this.clinicService = clinicService;
	}

	private Vet retrieveVet(int vetId) {
		Vet vet = this.clinicService.findVetById(vetId);
		if (vet == null) {
			throw new BadRequestException("Vet with Id '" + vetId + "' is unknown.");
		}
		return vet;
	}

	/**
	 * Create Vet
	 */
	@RequestMapping(value = "/vet", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Vet createVet(@RequestBody @Valid Vet vet, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new InvalidRequestException("Invalid Vet", bindingResult);
		}

		this.clinicService.saveVet(vet);

		return vet;
	}

	@GetMapping(value = "/vets")
	public Collection<Vet> showResourcesVetList() {
		return this.clinicService.findVets();
	}

	/**
	 * Update Vet
	 */
	@RequestMapping(value = "/vet/{vetId}", method = RequestMethod.PUT)
	public Vet updateVet(@PathVariable("vetId") int vetId, @Valid @RequestBody Vet vetRequest,
			final BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new InvalidRequestException("Invalid Vet", bindingResult);
		}

		Vet vetModel = retrieveVet(vetId);
		// This is done by hand for simplicity purpose. In a real life use-case we
		// should consider using MapStruct.
		vetModel.setFirstName(vetRequest.getFirstName());
		vetModel.setLastName(vetRequest.getLastName());
		vetModel.cleanSpecialities();
		for (Specialty specialty : vetRequest.getSpecialties()) {
			vetModel.addSpecialty(specialty);
		}
		this.clinicService.saveVet(vetModel);
		return vetModel;
	}

	/**
	 * Read single Vet
	 */
	@RequestMapping(value = "/vet/{vetId}", method = RequestMethod.GET)
	public Vet findVet(@PathVariable("vetId") int vetId) {
		return retrieveVet(vetId);
	}

	@GetMapping("/specialtytypes")
	Object getPetTypes() {
		return clinicService.findSpecialtyTypes();
	}

}
