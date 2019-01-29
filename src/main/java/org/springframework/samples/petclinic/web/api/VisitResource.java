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

import java.util.Objects;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.model.Pet;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.model.Visit;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 * @author Michael Isvy
 */
@RestController
public class VisitResource extends AbstractResourceController {

	private final ClinicService clinicService;

	@Autowired
	public VisitResource(ClinicService clinicService) {
		this.clinicService = clinicService;
	}

	@PostMapping("/owners/{ownerId}/pets/{petId}/vets/{vetId}/visits")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void createVisit(@PathVariable("petId") int petId, @PathVariable("vetId") int vetId,
			@Valid @RequestBody Visit visit, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new InvalidRequestException("Visit is invalid", bindingResult);
		}

		final Pet pet = clinicService.findPetById(petId);
		if (pet == null) {
			throw new BadRequestException("Pet with Id '" + petId + "' is unknown.");
		}

		final Vet vet = clinicService.findVetById(vetId);
		if (Objects.isNull(vet)) {
			throw new BadRequestException("Vet with Id '" + vetId + "' is unknown.");
		}

		pet.addVisit(visit);
		vet.addVisit(visit);

		clinicService.saveVisit(visit);
	}

	@DeleteMapping("/owners/{ownerId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteVisit(@PathVariable("visitId") int visitId) {
		Visit visit = clinicService.findVisitById(visitId);
		if (visit == null) {
			throw new BadRequestException("Visit with Id '" + visitId + "' is unknown.");
		}

		clinicService.deleteVisit(visit);
	}
}
