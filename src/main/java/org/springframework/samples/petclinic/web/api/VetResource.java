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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
    
    @GetMapping(value="/vets")
    public Collection<Vet> showResourcesVetList() {
        return this.clinicService.findVets();
    }
    
    public Vet retreiveVet(int vetId) {
        Vet vet = clinicService.getVetById(vetId);
        if(vet==null) {
            throw new BadRequestException("Vet with Id= " + vetId + " is unknown.");
        }
        return vet;
    }
    
    // You can't use "/vet/". It has to be exact URL coming to UI.
    @RequestMapping(value="/vet", method=RequestMethod.POST)
    public Vet createVet(@RequestBody Vet vet) {
        this.clinicService.saveVet(vet);
        return vet;
    }
    
    @GetMapping(value="/value/{vetId}")
    public Vet findVet(@PathVariable("vetId") int vetId) {
        return retreiveVet(vetId);
    }
    
    @RequestMapping(value="/vets/{vetId}", method=RequestMethod.PUT)
    public Vet updateVet(@PathVariable("vetId") int vetId, @RequestBody Vet vetRequest) {
        // Fetch the VET based on ID
        Vet vet = retreiveVet(vetId);
        
        // Get first and last name of Vet from request. 
        vet.setFirstName(vetRequest.getFirstName());
        vet.setLastName(vetRequest.getLastName());
        
        this.clinicService.saveVet(vet);
        return vet;
    }
}